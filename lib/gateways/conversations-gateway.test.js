import ConversationsGateway from './conversations-gateway';
import { Conversation } from 'lib/domain';

describe('ConversationsGateway', () => {
  let client;
  const tableName = 'conversations';

  beforeEach(() => {
    client = {
      put: jest.fn(request => ({
        promise: jest.fn(() => ({ Items: [request.Item] }))
      })),
      query: jest.fn(() => ({ promise: jest.fn() })),
      update: jest.fn(() => ({ promise: jest.fn() }))
    };
  });

  describe('create', () => {
    it('can create a conversation', async () => {
      const dateOfBirth = {};
      const firstName = 'sue';
      const lastName = 'taylor';
      const systemIds = ['xyz'];
      const email = 'Some@one.com';
      const address = '123 some road';
      const userEmail = 'email@email.com';
      const userOrganisation = 'Hackney';
      const userName = 'Me';
      const phone = '0712345678';
      const postcode = 'SP1 2RM';
      const signPostingMessage =
        'Hi Sue, I referred you to the garlic bread support service and suggested that you get in touch with the chocolate deliveries service';
      const discussedServices = [
        {
          id: 2,
          name: 'Garlic Bread Support',
          contactEmail: 'contact@gbs.com',
          conversationEmail: 'conversation@gbs.com',
          website: 'www.gbs.com',
          address: '123 Some st, E3 1J',
          conversationId: 'ABC121'
        },
        {
          id: 2,
          name: 'Chocolate Deliveries',
          contactEmail: 'contact@chocolatedeliveries.com',
          conversationEmail: 'conversation@chocolatedeliveries.com',
          website: 'www.chocolatedeliveries.com',
          address: '123 Other st, E3 1P'
        }
      ];

      const expectedRequest = {
        TableName: tableName,
        Item: expect.objectContaining({
          id: expect.any(String),
          resident: {
            firstName,
            lastName,
            phone,
            email,
            address,
            postcode,
            dateOfBirth
          },
          user: {
            name: userName,
            organisation: userOrganisation,
            email: userEmail
          },
          discussedServices: discussedServices,
          signPostingMessage: signPostingMessage,
          systemIds: undefined,
          created: expect.any(String),
          queryFirstName: firstName.toLowerCase(),
          queryLastName: lastName.toLowerCase()
        })
      };
      const conversationGateway = new ConversationsGateway({ client, tableName });

      const result = await conversationGateway.create({
        resident: {
          firstName,
          lastName,
          phone,
          email,
          address,
          postcode,
          dateOfBirth
        },
        user: {
          name: userName,
          organisation: userOrganisation,
          email: userEmail
        },
        discussedServices: discussedServices,
        signPostingMessage: signPostingMessage,
        systemIds: undefined,
        created: expect.any(String)
      });

      expect(client.put).toHaveBeenCalledWith(expectedRequest);
      expect(result).toBeInstanceOf(Conversation);
      expect(result.id).toStrictEqual(expect.any(String));
      expect(result.id.length).toBe(8);
      expect(result.resident.firstName).toEqual(firstName);
      expect(result.resident.lastName).toEqual(lastName);
    });
  });
});
