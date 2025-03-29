import { In, MongoRepository, Not, Repository } from "typeorm";
import { User } from "../entity/sql/User.js";
import { SurgeryLog } from "../entity/mongodb/SurgeryLog.js";
import { STATUS, USER_STATUS } from "../utils/dataTypes.js";
import { Affiliations } from "../entity/sql/Affiliations.js";

interface AvailabilityEvent {
	date: string;
	time: string;
	available: boolean;
	color: string;
}

interface StaffRecommendation {
	[expertise: string]: Array<{
		id: string;
		firstName: string;
		lastName: string;
	}>;
}

interface DoctorConflict {
	doctorId: string;
	doctorName: string;
	conflicts: Array<{
		surgeryId: number;
		date: Date;
		time: string;
		status: string;
	}>;
}

export class ScheduleService {
	constructor(
		private userRepo: Repository<User>,
		private surgeryLogRepo: MongoRepository<SurgeryLog>
	) {}

	private getDateRange() {
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Start of today

		const sevenDaysLater = new Date(today);
		sevenDaysLater.setDate(today.getDate() + 7);
		sevenDaysLater.setHours(23, 59, 59, 999); // End of 7th day

		return { start: today, end: sevenDaysLater };
	}

	async getUserAvailabilityCalendar(
		userId: string
	): Promise<AvailabilityEvent[]> {
		const { start, end } = this.getDateRange();

		// Query surgeries in the date range for the user.
		const surgeries = await this.surgeryLogRepo.find({
			where: {
				date: { $gte: start, $lte: end },
				$or: [{ "doctorsTeam.doctorId": userId }, { leadSurgeon: userId }],
			},
			select: ["date", "time", "doctorsTeam", "slots", "esitmatedEndTime"],
			order: {
				date: "ASC",
				time: "ASC",
			},
		});

		const groupedResults = this.groupEventsByDay(surgeries, start, end);
		return groupedResults;
	}

	async recommendStaff(
		affiliation: Affiliations,
		date: Date,
		time: string
	): Promise<StaffRecommendation> {
		// Retrieve ongoing surgeries for the given date and time.
		const ongoingSurgeries = await this.surgeryLogRepo.find({
			where: {
				status: { $eq: STATUS.ONGOING },
				date,
				time,
			},
			select: {
				leadSurgeon: true,
				doctorsTeam: true,
			},
		});

		// Build list of users (doctor ids) already in an ongoing surgery.
		const filteredUsers: string[] = [];
		for (const surgery of ongoingSurgeries) {
			filteredUsers.push(surgery.leadSurgeon);
			const team = surgery.doctorsTeam.map((doctor) => doctor.doctorId);
			filteredUsers.push(...team);
		}

		// Helper to create a base query builder for users.
		const createBaseQB = () => {
			const qb = this.userRepo
				.createQueryBuilder("user")
				.leftJoin("user.progress", "progress")
				.leftJoin("user.affiliation", "affiliation")
				.leftJoin("user.role", "role")
				.where("user.account_status = :active", { active: USER_STATUS.ACTIVE })
				.andWhere("role.name != :adminRole", { adminRole: "Admin" })
				.orderBy("progress.completedCount", "DESC")
				.select([
					"user.id",
					"user.first_name",
					"user.last_name",
					"user.picture",
					"role.name",
				]);

			if (filteredUsers.length > 0) {
				qb.andWhere("user.id NOT IN (:...filteredUsers)", { filteredUsers });
			}

			return qb;
		};

		// Create separate query builders for related and other users.
		const qbRelated = createBaseQB().andWhere(
			"affiliation.id = :affiliationId",
			{ affiliationId: affiliation.id }
		);
		const qbOther = createBaseQB().andWhere(
			"affiliation.id != :affiliationId",
			{ affiliationId: affiliation.id }
		);

		// Execute both queries in parallel.
		const [relatedUsers, otherUsers] = await Promise.all([
			qbRelated.getMany(),
			qbOther.getMany(),
		]);

		const staffRecommendation = this.addUsersToRecommendation(
			relatedUsers,
			otherUsers
		);
		return staffRecommendation;
	}

	async getConflictResolutionData() {
		const surgeries = await this.surgeryLogRepo.find({
			where: { status: STATUS.ONGOING },
			select: ["surgeryId", "doctorsTeam", "date", "time", "status"],
		});

		const doctorMap = new Map<string, DoctorConflict>();

		surgeries.forEach((surgery) => {
			surgery.doctorsTeam?.forEach((doctor) => {
				if (!doctor.doctorId) return;

				const conflictEntry = doctorMap.get(doctor.doctorId) || {
					doctorId: doctor.doctorId,
					doctorName: "", // Would need additional data to populate names
					conflicts: [],
				};

				conflictEntry.conflicts.push({
					surgeryId: surgery.surgeryId,
					date: surgery.date,
					time: surgery.time,
					status: surgery.status,
				});

				doctorMap.set(doctor.doctorId, conflictEntry);
			});
		});

		return Array.from(doctorMap.values())
			.filter((entry) => entry.conflicts.length > 1)
			.map((entry) => ({
				...entry,
				conflicts: entry.conflicts.sort(
					(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
				),
			}));
	}

	private groupEventsByDay(
		surgeries: SurgeryLog[],
		current: Date,
		end: Date
	): AvailabilityEvent[] {
		const events: AvailabilityEvent[] = [];
		let surgeryIndex = 0;

		while (current <= end) {
			const dayStr = current.toISOString().split("T")[0];

			// Gather surgeries for this day.
			const daySurgeries: SurgeryLog[] = [];
			while (
				surgeryIndex < surgeries.length &&
				new Date(surgeries[surgeryIndex].date).toISOString().split("T")[0] ===
					dayStr
			) {
				daySurgeries.push(surgeries[surgeryIndex]);
				surgeryIndex++;
			}

			// If no surgeries on this day, mark entire day as available.
			if (daySurgeries.length === 0) {
				events.push({
					date: dayStr,
					time: "00:00 - 24:00",
					color: "green",
					available: true,
				});
			} else {
				// If first surgery does not start at midnight, add available period before it.
				if (daySurgeries[0].time !== "00:00") {
					events.push({
						date: dayStr,
						time: `00:00 - ${daySurgeries[0].time}`,
						color: "green",
						available: true,
					});
				}

				// For each surgery, add its occupied period and any gap until the next surgery.
				for (let i = 0; i < daySurgeries.length; i++) {
					const surgery = daySurgeries[i];

					// Add the surgery period.
					events.push({
						date: dayStr,
						time: `${surgery.time} - ${surgery.esitmatedEndTime}`,
						color: "red",
						available: false,
					});

					// If there is a next surgery, and if there's a gap between the current surgery's estimated end time and the next surgery's start.
					if (i < daySurgeries.length - 1) {
						const nextSurgery = daySurgeries[i + 1];
						if (surgery.esitmatedEndTime < nextSurgery.time) {
							events.push({
								date: dayStr,
								time: `${surgery.esitmatedEndTime} - ${nextSurgery.time}`,
								color: "green",
								available: true,
							});
						}
					} else {
						// For the last surgery, if it doesn't end at the end of the day, add available period until day end.
						if (
							surgery.esitmatedEndTime !== "24:00" &&
							surgery.esitmatedEndTime !== "23:59"
						) {
							events.push({
								date: dayStr,
								time: `${surgery.esitmatedEndTime} - 24:00`,
								color: "green",
								available: true,
							});
						}
					}
				}
			}
			// Move to the next day.
			current.setDate(current.getDate() + 1);
		}

		return events;
	}

	private addUsersToRecommendation(relatedUsers: User[], otherUsers: User[]) {
		const staffRecommendation: StaffRecommendation = {};
		console.log(otherUsers);
		relatedUsers.forEach((user) => {
			const roleName = user.role?.name || "Unassigned";

			if (!staffRecommendation[roleName]) {
				staffRecommendation[roleName] = [];
			}
			staffRecommendation[roleName].push({
				id: user.id,
				firstName: user.first_name,
				lastName: user.last_name,
			});
		});

		otherUsers.forEach((user) => {
			const roleName = user.role?.name || "Unassigned";

			if (!staffRecommendation[roleName]) {
				staffRecommendation[roleName] = [];
			}
			staffRecommendation[roleName].push({
				id: user.id,
				firstName: user.first_name,
				lastName: user.last_name,
			});
		});
		return staffRecommendation;
	}
}
