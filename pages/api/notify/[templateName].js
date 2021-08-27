import createEndpoint from 'lib/api/utils/createEndpoint';
import Response from 'lib/api/domain/Response';
import { getTemplatePreview } from 'lib/dependencies';

export const endpoint = ({ getTemplatePreview }) =>
  createEndpoint({ allowedMethods: ['POST'] }, async ({ params: { templateName }, body }) => {
    const response = await getTemplatePreview.execute({ templateName, id: body.id });
    return Response.ok(response);
  });

export default endpoint({ getTemplatePreview });
