// returns admin headers (with token created in global-setup)

let adminToken = "" + process.env.ADMIN_TOKEN;

export function adminHeaders(token = adminToken) {
  return { cookie: token };
}
