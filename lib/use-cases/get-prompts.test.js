import GetPrompts from 'lib/use-cases/get-prompts';

describe('Get prompts use case', () => {
  it('can get all the prompts', async () => {
    const promptsGateway = {
      getTable: jest.fn(() => [])
    };
    const tableName = 'Table';
    const getPrompts = new GetPrompts({ promptsGateway, tableName });

    const result = await getPrompts.execute();

    expect(promptsGateway.getTable).toHaveBeenCalledWith(tableName);
    expect(result).toEqual([]);
  });
});
