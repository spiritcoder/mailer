import { Request, Response } from 'express';
import { templateRepository } from '../infra/repositories/index';
import { NotFoundError, BadRequestError, DataNotSavedError } from '../errors/index'
import { createResponse} from '../utils/index';
import * as fs from "fs";

const fsInstance = fs.promises;

class TemplateService {

  createTemplate = async (req: Request, res: Response) => {
    const { templateName, userId, template, variables } = req.body;

    const userTemplateFound = await templateRepository.findOne({ userId, templateName });
    if (userTemplateFound?._id != null) throw new BadRequestError("Credentials Already Exists");

    //parse the html and save it as a handlebar Template
    const trimedTemplateName = templateName.split(' ').join('');
    const templateLink = `./src/uploads/templates/${userId}-${Date.now()}-${trimedTemplateName}.hbs`;
    await fsInstance.writeFile(templateLink, template, 'utf-8');
    const saveSMTP = await templateRepository.create({ templateName, userId, templateLink, variables });
    if (saveSMTP == null) throw new DataNotSavedError("An error occured ssving the details");
    
    return createResponse(res, 200, "Template Details saved successfully", null);
  }


  updateTemplate = async (req: Request, res: Response) => {
    const { templateId, template, variables, userId, templateName } = req.body;

    const userTemplateFound = await templateRepository.findOneById(templateId);
    if (userTemplateFound?._id == null) throw new BadRequestError("Template Does not Exists");

    let templateLink = "";
    if (template != null) {
      const trimedTemplateName = templateName.split(' ').join('');
      templateLink = `./src/uploads/templates/${userId}-${Date.now()}-${trimedTemplateName}.hbs`;
      await fsInstance.writeFile(templateLink, template, 'utf-8');
      await fsInstance.unlink(userTemplateFound.templateLink)
    }
    const updateTemplate = await templateRepository.updateOne(templateId, { templateName, templateLink, variables, userId });
    if (updateTemplate == null) throw new DataNotSavedError("An error occured updating the Template");

    return createResponse(res, 200, "Template Updated", null);
  }

  getATemplate = async (req: Request, res: Response) => {
    const templateId = req.params.templateId;
    const templateFound = await templateRepository.findOneById(templateId)

    const newResponse = {
      templateName: templateFound?.templateName,
      _id: templateFound?._id,
      createdAt: templateFound?.createdAt,
      updatedAt: templateFound?.updatedAt,
      variables: templateFound?.variables,
      userId: templateFound?.userId,
      template: ""
    };

    if (templateFound != null) {
      const template = await fsInstance.readFile(templateFound.templateLink, 'utf-8');
      newResponse.template = template;
    }
    return createResponse(res, 200, "Found Template", newResponse)
  }

  deleteTemplate = async (req: Request, res: Response) => {
    const templateId = req.params.templateId;

    const foundTemplate = await templateRepository.findOne({ _id: templateId });
    const templateDeleted = await templateRepository.deleteById(templateId);
    if (templateDeleted == null) throw new DataNotSavedError("An error occured deleting the template Detail");
    
    if (foundTemplate != null) await fsInstance.unlink(foundTemplate?.templateLink);
      
    return createResponse(res, 200, "Template Deleted", null);
  }

  getUserTemplates = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const allUserTemplates = await templateRepository.queryMore({ userId });
    
    var responseData = allUserTemplates.map(function(item){
      return {templateName : item["templateName"], userId : item["userId"], variables : item["variables"], _id: item["_id"], createdAt: item['createdAt'], updatedAt: item['updatedAt']}
    });
    return createResponse(res, 200, "Found User Templates", responseData);
  }
}

export const templateController = new TemplateService();

