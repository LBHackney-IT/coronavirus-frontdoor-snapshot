import createEndpoint from 'lib/api/utils/createEndpoint';
import Response from 'lib/api/domain/Response';
import { sendResidentMessage } from 'lib/dependencies';

export const endpoint = ({ sendResidentMessage }) =>
  createEndpoint({ allowedMethods: ['POST'] }, async ({ params: { id }, body: request }) => {
    await sendResidentMessage.execute({ id, sendBySms: request.sendBySms });
    return Response.noContent();
  });

export default endpoint({ sendResidentMessage });
