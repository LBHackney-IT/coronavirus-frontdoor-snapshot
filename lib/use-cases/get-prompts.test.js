import GetPrompts from 'lib/use-cases/get-prompts';

describe('Get prompts use case', () => {
  it('can get all the prompts', async () => {
    const resourcesGateway = {
      getTable: jest.fn(() => ([]))
    };
    const tableName = "Table"
    const getPrompts = new GetPrompts({ resourcesGateway, tableName});

    const result = await getPrompts.execute();

    expect(resourcesGateway.getTable).toHaveBeenCalledWith(tableName);
    expect(result).toEqual([]);
  });
});
