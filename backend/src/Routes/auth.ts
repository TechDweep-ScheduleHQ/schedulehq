import express from "express";
import {
  emailLogin,
  forgotPassword,
  getAllTimezone,
  googleLoginOAuth,
  ResetPassword,
  signupByEmail,
  verifyEmail,
} from "../Controllers/auth";
import { authentication } from "../Middleware/auth";
import { validateRequest } from "../Middleware/validateRequest";
import {
  emailLoginSchema,
  resetPasswordSchema,
  signupByEmailSchema,
} from "../validation/auth.schema";

const router = express.Router();

router.post(
  "/signupByEmail",
  validateRequest(signupByEmailSchema),
  signupByEmail
);
router.post("/verifyEmail", verifyEmail);
router.post("/loginEmail", validateRequest(emailLoginSchema), emailLogin);
router.post("/loginGoogle", googleLoginOAuth);
router.post("/forgotpassword", forgotPassword);
router.post(
  "/resetPassword",
  validateRequest(resetPasswordSchema),
  ResetPassword
);
router.get("/getTimezone", authentication, getAllTimezone);

export default router;
