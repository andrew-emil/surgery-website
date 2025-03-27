import {
	roleRepo,
	userRepo,
	surgeryLogsRepo,
	authenticationRequestRepo,
	surgeryRepo,
} from "../config/repositories.js";
import { NotificationService } from "../service/NotificationService.js";
import { ScheduleService } from "../service/ScheduleService.js";
import { SurgeryAuthService } from "../service/SurgeryAuthService.js";
import { TrainingService } from "../service/TrainingService.js";

export let trainingService: TrainingService;
export let surgeryAuthService: SurgeryAuthService;
export let notificationService: NotificationService;
export let scheduleService: ScheduleService;

export const intializeServices = () => {
	trainingService = new TrainingService(
		userRepo,
		roleRepo,
		surgeryLogsRepo,
		authenticationRequestRepo
	);

	surgeryAuthService = new SurgeryAuthService(
		trainingService,
		authenticationRequestRepo,
		surgeryLogsRepo,
		surgeryRepo
	);

	notificationService = new NotificationService();

	scheduleService = new ScheduleService(userRepo, surgeryLogsRepo);
};
