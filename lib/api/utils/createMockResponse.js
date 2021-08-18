export default function createMockResponse() {
  return {
    body: undefined,
    statusCode: undefined,
    headers: {},
    status: function (statusCode) {
      this.statusCode = statusCode;
    },
    setHeader: function (key, value) {
      this.headers[key] = value;
    },
    send: function (body) {
      this.body = body;
    },
    end: jest.fn()
  };
}
