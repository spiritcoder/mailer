import express from 'express'
const router = express.Router();
import { validateRequest } from '../middlewares/validate-request';
import * as v from '../validators/index';
import { applyGuard, upload } from '../utils/';
/*
|-------------------------------------------------------------------------------
| Controller Import
|-------------------------------------------------------------------------------
*/
import {authController, emailVerificationController, mailingListController, passwordResetController, SMTPController, templateController, emailBroadcastController} from "../controllers"


/*
|-------------------------------------------------------------------------------
| Route Declearation
|-------------------------------------------------------------------------------
*/

/*----------Auth Routes--------------------*/
router.post('/user/signUp', v.signupValidator,validateRequest,authController.signUp);
router.post('/user/logIn', v.loginValidator, validateRequest, authController.logIn);
router.post('/user/signOut', authController.signOut);

/*----------Email Verification Service Routes--------------------*/
router.post('/user/initiateEmailVerification', applyGuard, v.emailValidator, validateRequest, emailVerificationController.initiateEmailVerification);
router.post('/user/finalizeEmailVerification', applyGuard, v.finalizeVerificationValidator, validateRequest, emailVerificationController.finalizeEmailVerification);

/*----------Password Service Routes--------------------*/
router.post('/user/initiatePasswordReset', applyGuard, v.emailValidator, validateRequest, passwordResetController.initiatepasswordReset);
router.post('/user/finalizePasswordReset', applyGuard, v.finalizePasswordResetValidator, validateRequest, passwordResetController.finalizePasswordReset);
router.post('/user/changePassword', applyGuard, v.changePasswordValidator, validateRequest, passwordResetController.changePassword);

/*----------SMTP Service Routes--------------------*/
router.post('/smtp/createSmtp', applyGuard, v.createSMTPValidator, validateRequest, SMTPController.createSMTPDetails);
router.get('/smtp/getUserSmtp/:userId', applyGuard, v.getUserIdValidator, validateRequest, SMTPController.getUserSMTPDetails);
router.get('/smtp/getAnSmtp/:smtpId', applyGuard, v.SMTPIdValidator, validateRequest, SMTPController.getAnSMTPDetail);
router.delete('/smtp/deleteAnSmtp/:smtpId', applyGuard, v.SMTPIdValidator, validateRequest, SMTPController.deleteSMTPDetails);
router.post('/smtp/updateAnSmtp', applyGuard, v.bodySMTPIdValidator, applyGuard, v.createSMTPValidator, validateRequest, SMTPController.updateSMTPDetails);

/*----------Mailing List Service Routes--------------------*/
router.post('/mailer/createMailingList', applyGuard, upload.single("file"), validateRequest, mailingListController.createMailingList);
router.get('/mailer/getUserMailingList/:userId', applyGuard, v.getUserIdValidator, validateRequest, mailingListController.getUserMailingLists);
router.get('/mailer/getAMailingList/:mailingListId', applyGuard, v.mailListIdValidator, validateRequest, mailingListController.getAMailingList);
router.delete('/mailer/deleteAMailingList/:mailingListId', applyGuard, v.mailListIdValidator, validateRequest, mailingListController.deleteMailingList);
router.post('/mailer/updateAMailingList', applyGuard, upload.single("file"), validateRequest, mailingListController.updateMailingList);


/*----------Template Service Routes--------------------*/
router.post('/template/createTemplate', applyGuard, v.createTemplateValidator, validateRequest, templateController.createTemplate);
router.get('/template/getUserTemplates/:userId', applyGuard, v.getUserIdValidator, validateRequest, templateController.getUserTemplates);
router.get('/template/getATemplate/:templateId', applyGuard, v.templateIdValidator, validateRequest, templateController.getATemplate);
router.delete('/template/deleteATemplate/:templateId', applyGuard, v.templateIdValidator, validateRequest, templateController.deleteTemplate);
router.post('/template/updateATemplate', applyGuard, v.updateTemplateValidator, validateRequest, templateController.updateTemplate);


/*----------Mail Sending Service Routes--------------------*/
router.post('/mail/sendMail', applyGuard, v.sendMailValidator, validateRequest, emailBroadcastController.sendMail);
router.get('/mail/viewUserLog/:userId', applyGuard, applyGuard, v.getUserIdValidator, validateRequest, emailBroadcastController.fetchUserMailLog);
router.get('/mail/fetchAMailLog/:mailLogId', applyGuard, v.mailLogIdValidator, validateRequest, emailBroadcastController.fetchAMailLog);



/*
|-------------------------------------------------------------------------------
| Route Export
|-------------------------------------------------------------------------------
*/
export { router as appRoutes }