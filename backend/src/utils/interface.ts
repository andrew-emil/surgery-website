import { SURGERY_TYPE } from "./dataTypes.js";

// interfaces/TrainingProgress.ts
export interface TrainingProgress {
	completed: number;
	required: number;
	remaining: number;
	met: boolean;
	type: SURGERY_TYPE | null;
}

// interfaces/EligibilityResult.ts
export interface EligibilityResult extends TrainingProgress {
	eligible: boolean;
	reason: string;
}
