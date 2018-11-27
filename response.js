class Response {
  constructor(code, reason, content) {
    this.code = code;
    this.reason = reason;
    this.content = content;
  }
}

module.exports = function response(code = 200, reason = '', content = {}) {
  return new Response(code, reason, content);
};