import express from "express";
import {
  authGoogleCalender,
  authZoom,
  completeSetupOnboarding,
  googleCalenderCallback,
  zoomCallback,
} from "../Controllers/onboarding";
import { authentication } from "../Middleware/auth";
import { validateRequest } from "../Middleware/validateRequest";
import { completeSetupOnboardingSchema } from "../validation/onboarding.schema";

const router = express.Router();

router.get("/auth/google-calender", authentication, authGoogleCalender);
router.get("/google-calendar/callback", googleCalenderCallback);
router.get("/auth/zoom", authentication, authZoom);
router.get("/zoom/callback", zoomCallback);
router.post(
  "/setup/onboarding",
  authentication,
  validateRequest(completeSetupOnboardingSchema),
  completeSetupOnboarding
);

export default router;
