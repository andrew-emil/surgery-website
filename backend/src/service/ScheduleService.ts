import { Between, MongoRepository, Repository } from "typeorm";
import { User } from "../entity/sql/User.js";
import { SurgeryLog } from "../entity/mongodb/SurgeryLog.js";
import { STATUS, USER_STATUS } from "../utils/dataTypes.js";

interface AvailabilityEvent {
	date: string;
	time: string;
	available: boolean;
	color: string;
	availableSlots: number;
	surgeryStatus: string;
}

interface StaffRecommendation {
	[expertise: string]: Array<{
		id: string;
		firstName: string;
		lastName: string;
		residencyLevel?: number;
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

		const timeSlots = [
			"00:00",
			"01:00",
			"02:00",
			"03:00",
			"04:00",
			"05:00",
			"06:00",
			"07:00",
			"08:00",
			"09:00",
			"10:00",
			"11:00",
			"12:00",
			"13:00",
			"14:00",
			"15:00",
			"16:00",
			"17:00",
			"18:00",
			"19:00",
			"20:00",
			"21:00",
			"22:00",
			"23:00",
		];

		const surgeries = await this.surgeryLogRepo.find({
			where: { date: Between(start, end) },
			select: ["date", "time", "doctorsTeam", "slots", "status"],
		});

		const userSurgeries = await this.surgeryLogRepo.find({
			where: {
				date: Between(start, end),
				doctorsTeam: { $elemMatch: { doctorId: userId } },
			},
			select: ["date", "time"],
		});

		const userBusySlots = new Set(
			userSurgeries.map(
				(s) => `${s.date.toISOString().split("T")[0]}_${s.time}`
			)
		);

		const surgeryLookup: { [key: string]: any } = {};
		surgeries.forEach((surgery) => {
			const surgeryDate = surgery.date.toISOString().split("T")[0];
			const key = `${surgeryDate}_${surgery.time}`;
			surgeryLookup[key] = surgery;
		});

		const results: AvailabilityEvent[] = [];

		const current = new Date(start);
		while (current <= end) {
			const dayStr = current.toISOString().split("T")[0];

			// For each predefined time slot, create an event.
			for (const time of timeSlots) {
				const key = `${dayStr}_${time}`;
				const surgery = surgeryLookup[key];

				if (surgery) {
					// Compute available slots based on the surgery record.
					const assignedDoctors = surgery.doctorsTeam?.length || 0;
					const availableSlots = surgery.slots - assignedDoctors;
					const isSurgeryAvailable =
						availableSlots > 0 && surgery.status === STATUS.ONGOING;
					const isUserAvailable = !userBusySlots.has(key);
					const isAvailable = isSurgeryAvailable && isUserAvailable;

					results.push({
						date: dayStr,
						time,
						available: isAvailable,
						color: isAvailable ? "green" : "red",
						availableSlots: isAvailable ? availableSlots : 0,
						surgeryStatus: surgery.status,
					});
				} else {
					// No surgery is scheduled for this time slot.
					results.push({
						date: dayStr,
						time,
						available: true,
						color: "green",
						// Set a default value for availableSlots. Adjust as necessary.
						availableSlots: 1,
						surgeryStatus: "AVAILABLE",
					});
				}
			}
			current.setDate(current.getDate() + 1);
		}

		return results;
	}

	async recommendStaff() {
		const ongoingSurgeryLogs = await this.surgeryLogRepo.find({
			where: {
				status: STATUS.ONGOING,
				doctorsTeam: { $exists: true, $ne: [] },
			},
			projection: { doctorsTeam: 1 },
		});

		const busyStaffIds = new Set<string>();
		ongoingSurgeryLogs.forEach((surgery) => {
			surgery.doctorsTeam?.forEach((doctor) => {
				if (doctor.doctorId) busyStaffIds.add(doctor.doctorId);
			});
		});

		const query = this.userRepo
			.createQueryBuilder("user")
			.leftJoinAndSelect("user.role", "role")
			.where("user.account_status = :active", { active: USER_STATUS.ACTIVE });

		if (busyStaffIds.size > 0) {
			query.andWhere("user.id NOT IN (:...busyStaffIds)", {
				busyStaffIds: Array.from(busyStaffIds),
			});
		}

		const availableStaff = await query
			.select([
				"user.id",
				"user.first_name",
				"user.last_name",
				"user.residencyLevel",
				"role.name",
			])
			.getMany();

		const groupedStaff = availableStaff.reduce<StaffRecommendation>(
			(acc, user) => {
				const expertise = user.role?.name || "Unknown";
				const staffInfo = {
					id: user.id,
					firstName: user.first_name,
					lastName: user.last_name,
					residencyLevel: user.residencyLevel,
				};

				if (!acc[expertise]) {
					acc[expertise] = [];
				}
				acc[expertise] = acc[expertise] || [];
				acc[expertise].push(staffInfo);
				return acc;
			},
			{}
		);

		return groupedStaff;
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
}
