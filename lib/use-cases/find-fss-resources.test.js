import FindFssResources from 'lib/use-cases/find-fss-resources';

describe('Find Fss resources use case', () => {
  it('can find fss resources', async () => {
    const fssResourcesGateway = { all: jest.fn() };
    const findFssResources = new FindFssResources({ fssResourcesGateway });

    await findFssResources.execute();
    expect(fssResourcesGateway.all).toHaveBeenCalled();
  });
});
