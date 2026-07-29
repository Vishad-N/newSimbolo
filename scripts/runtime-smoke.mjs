import { execFileSync } from 'node:child_process';

const API = 'http://localhost:3001/api/v1';
const pages = [
  'http://localhost:3003/',
  'http://localhost:3003/services',
  'http://localhost:3003/services/seo',
  'http://localhost:3003/packages',
  'http://localhost:3003/blogs',
  'http://localhost:3003/case-studies',
  'http://localhost:3003/about-us',
  'http://localhost:3003/help-center',
  'http://localhost:3003/contact',
  'http://localhost:3003/privacy-policy',
  'http://localhost:3003/terms',
  'http://localhost:3003/refund-policy',
  'http://localhost:3003/faq',
  'http://localhost:3000/',
  'http://localhost:3000/services',
  'http://localhost:3000/packages',
  'http://localhost:3000/case-studies',
  'http://localhost:3000/media',
  'http://localhost:3002/',
  'http://localhost:3002/dashboard',
  'http://localhost:3002/profile',
  'http://localhost:3002/projects',
  'http://localhost:3002/orders',
  'http://localhost:3002/payments',
  'http://localhost:3002/messages',
  'http://localhost:3002/notifications',
];

const results = [];
const state = {};

function log(name, status, details = '') {
  results.push({ name, status, details });
  console.log(`${status} ${name}${details ? ` - ${details}` : ''}`);
}

function db(sql) {
  return execFileSync('docker', ['exec', 'simbolo-postgres', 'psql', '-U', 'postgres', '-d', 'simbolo', '-t', '-A', '-c', sql], {
    encoding: 'utf8',
  }).trim();
}

async function req(name, method, url, { token, body, expected = [200, 201], headers = {} } = {}) {
  const response = await fetch(url, {
    method,
    headers: {
      ...(body instanceof FormData ? {} : { 'content-type': 'application/json' }),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let parsed = text;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {}
  const ok = expected.includes(response.status);
  log(name, ok ? 'PASS' : 'FAIL', `${method} ${url} -> ${response.status}${ok ? '' : ` ${text.slice(0, 180)}`}`);
  return { ok, status: response.status, body: parsed, text };
}

const data = (response) => response?.body?.data ?? response?.body;

async function page(url) {
  const start = Date.now();
  const response = await fetch(url);
  const text = await response.text();
  if (response.status === 404) {
    log(`Page ${url}`, 'FAIL', '404');
    return;
  }
  log(`Page ${url}`, response.ok && !text.includes('__next_error__') ? 'PASS' : 'FAIL', `${response.status}, ${Date.now() - start}ms`);
  log(`Metadata ${url}`, /<title|description|application-name/i.test(text) ? 'PASS' : 'FAIL');
}

async function main() {
  await req('Health', 'GET', `${API}/health/ready`);
  for (const url of pages) await page(url);

  await req('No-auth protected API rejected', 'GET', `${API}/users/me`, { expected: [401] });
  await req('Invalid JWT rejected', 'GET', `${API}/users/me`, { headers: { authorization: 'Bearer invalid.jwt' }, expected: [401] });
  await req('Invalid login validation', 'POST', `${API}/auth/login`, { body: { email: 'bad', password: '' }, expected: [400] });

  const adminLogin = await req('Admin login', 'POST', `${API}/auth/login`, {
    body: { email: 'admin@simbolo.ai', password: 'Admin@123456' },
  });
  const adminToken = data(adminLogin).accessToken;
  state.adminUserId = data(adminLogin).user.id;

  const suffix = Date.now();
  state.clientEmail = `qa.client.${suffix}@example.com`;
  const clientPassword = 'Client@123456';
  const registration = await req('Client register', 'POST', `${API}/auth/register`, {
    body: { email: state.clientEmail, password: clientPassword, firstName: 'QA', lastName: 'Client', phone: '+15550123456' },
  });
  state.clientUserId = data(registration).userId;
  const verificationToken = db(`select token from verification_tokens where identifier='${state.clientEmail}' limit 1`);
  await req('Client verify', 'POST', `${API}/auth/verify-email`, { body: { email: state.clientEmail, token: verificationToken } });
  const clientLogin = await req('Client login', 'POST', `${API}/auth/login`, {
    body: { email: state.clientEmail, password: clientPassword },
  });
  const clientToken = data(clientLogin).accessToken;
  log('Registration DB status', db(`select status from users where email='${state.clientEmail}'`) === 'ACTIVE' ? 'PASS' : 'FAIL');

  const clientProfile = await req('Admin create client profile', 'POST', `${API}/clients`, {
    token: adminToken,
    body: { userId: state.clientUserId, billingAddress: '100 QA Street', timezone: 'Asia/Kolkata' },
  });
  state.clientId = data(clientProfile).id;
  await req('Client edit profile', 'PUT', `${API}/profiles/client`, {
    token: clientToken,
    body: { billingAddress: '101 QA Street', timezone: 'Asia/Kolkata' },
  });

  const service = await req('Admin create service', 'POST', `${API}/services`, {
    token: adminToken,
    body: { name: `QA Runtime Service ${suffix}`, shortDescription: 'Runtime service', fullDescription: 'Runtime service body', type: 'RETAINER', basePrice: 1250 },
  });
  state.serviceId = data(service).id;
  state.serviceSlug = data(service).slug;
  await req('Admin edit service', 'PATCH', `${API}/services/${state.serviceId}`, { token: adminToken, body: { shortDescription: 'Updated runtime service' } });
  await req('Public service API', 'GET', `${API}/services/${state.serviceSlug}`);

  const pack = await req('Admin create package', 'POST', `${API}/packages`, {
    token: adminToken,
    body: { name: `QA Runtime Package ${suffix}`, description: 'Runtime package', serviceId: state.serviceId, type: 'STARTER', basePrice: 4999, billingInterval: 'one-time', isPopular: true },
  });
  state.packageId = data(pack).id;
  state.packageSlug = data(pack).slug;
  await req('Admin edit/publish package', 'PATCH', `${API}/packages/${state.packageId}`, { token: adminToken, body: { isPopular: false } });
  await req('Public package API', 'GET', `${API}/packages/${state.packageSlug}`);

  const order = await req('Client purchase package/order', 'POST', `${API}/orders`, {
    token: clientToken,
    body: { clientId: state.clientId, packageId: state.packageId, serviceId: state.serviceId, totalAmount: 4999, taxAmount: 900, discountAmount: 0, netAmount: 5899, currency: 'INR' },
  });
  state.orderId = data(order).id;
  log('Order DB persisted', db(`select count(*) from orders where id='${state.orderId}'`) === '1' ? 'PASS' : 'FAIL');

  const paymentOrder = await req('Sandbox payment order', 'POST', `${API}/payments/create-order`, { token: clientToken, body: { orderId: state.orderId, currency: 'INR' } });
  const gatewayOrderId = data(paymentOrder).gatewayOrder.gatewayOrderId;
  await req('Sandbox payment failed signature', 'POST', `${API}/payments/verify`, {
    token: clientToken,
    body: { razorpayOrderId: gatewayOrderId, razorpayPaymentId: `pay_bad_${suffix}`, razorpaySignature: 'bad-signature' },
    expected: [403],
  });
  const paymentOrderRetry = await req('Sandbox payment retry order', 'POST', `${API}/payments/create-order`, { token: clientToken, body: { orderId: state.orderId, currency: 'INR' } });
  const retryGatewayOrderId = data(paymentOrderRetry).gatewayOrder.gatewayOrderId;
  await req('Sandbox payment success', 'POST', `${API}/payments/verify`, {
    token: clientToken,
    body: { razorpayOrderId: retryGatewayOrderId, razorpayPaymentId: `pay_good_${suffix}`, razorpaySignature: 'mock-signature' },
  });

  const project = await req('Admin create project', 'POST', `${API}/projects`, {
    token: adminToken,
    body: { name: `QA Runtime Project ${suffix}`, orderId: state.orderId, clientId: state.clientId, managerId: state.adminUserId, status: 'PLANNING', priority: 'MEDIUM', budget: 5899 },
  });
  state.projectId = data(project).id;
  await req('Client view project progress', 'GET', `${API}/projects/${state.projectId}`, { token: clientToken });
  await req('Admin create task', 'POST', `${API}/tasks`, { token: adminToken, body: { projectId: state.projectId, title: 'Runtime QA task' } });
  const deliverable = await req('Admin create deliverable', 'POST', `${API}/deliverables`, { token: adminToken, body: { projectId: state.projectId, title: 'Runtime deliverable' } });
  state.deliverableId = data(deliverable).id;
  await req('Client view deliverable', 'GET', `${API}/deliverables/${state.deliverableId}`, { token: clientToken });

  const conversation = await req('Admin create conversation', 'POST', `${API}/chat/conversations`, {
    token: adminToken,
    body: { title: 'Runtime conversation', projectId: state.projectId, participantIds: [state.clientUserId, state.adminUserId] },
  });
  state.conversationId = data(conversation).id;
  await req('Client send chat message', 'POST', `${API}/chat/conversations/${state.conversationId}/messages`, {
    token: clientToken,
    body: { conversationId: state.conversationId, content: 'Runtime chat message' },
  });
  log('Chat DB persisted', Number(db(`select count(*) from messages where "conversationId"='${state.conversationId}'`)) > 0 ? 'PASS' : 'FAIL');

  const invoice = await req('Admin generate invoice', 'POST', `${API}/invoices`, {
    token: adminToken,
    body: { clientId: state.clientId, orderId: state.orderId, dueDate: new Date(Date.now() + 604800000).toISOString(), items: [{ name: 'Runtime package', quantity: 1, unitPrice: 4999 }], taxPercentage: 18, currency: 'INR' },
  });
  state.invoiceId = data(invoice).id;
  await req('Client download invoice PDF', 'GET', `${API}/invoices/${state.invoiceId}/pdf`, { token: clientToken });
  await req('Client notifications', 'GET', `${API}/notifications`, { token: clientToken });
  await req('Admin analytics', 'GET', `${API}/analytics/admin`, { token: adminToken });
  await req('AI capabilities', 'GET', `${API}/ai/capabilities`, { token: adminToken });
  await req('AI generate', 'POST', `${API}/ai/generate`, { token: adminToken, body: { feature: 'BLOG_OUTLINE', prompt: 'Runtime QA outline' } });

  const authorCreate = await req('Admin create blog author', 'POST', `${API}/blogs/authors`, { token: adminToken, body: { userId: state.adminUserId, bio: 'Runtime author' }, expected: [200, 201, 409] });
  const authorId = data(authorCreate)?.id || db(`select id from blog_authors where "userId"='${state.adminUserId}' limit 1`);
  const blog = await req('Admin create/publish blog', 'POST', `${API}/blogs`, { token: adminToken, body: { title: `Runtime Blog ${suffix}`, excerpt: 'Runtime blog', content: '# Runtime Blog', status: 'PUBLISHED', authorId, tags: ['Runtime'] } });
  state.blogSlug = data(blog).slug;
  await req('Public blog API', 'GET', `${API}/blogs/${state.blogSlug}`);
  const caseStudy = await req('Admin create/publish case study', 'POST', `${API}/case-studies`, {
    token: adminToken,
    body: { title: `Runtime Case ${suffix}`, summary: 'Summary', challenge: 'Challenge', solution: 'Solution', results: 'Results', clientName: 'QA Client', industry: 'Software', status: 'PUBLISHED', serviceId: state.serviceId },
  });
  state.caseStudySlug = data(caseStudy).slug;
  await req('Public case study API', 'GET', `${API}/case-studies/${state.caseStudySlug}`);
  await page(`http://localhost:3003/blogs/${state.blogSlug}`);
  await page(`http://localhost:3003/case-studies/${state.caseStudySlug}`);

  await req('Client blocked from users admin API', 'GET', `${API}/users`, { token: clientToken, expected: [403] });
  await req('Malformed service rejected', 'POST', `${API}/services`, { token: adminToken, body: { name: '' }, expected: [400] });
  await req('Admin delete package', 'DELETE', `${API}/packages/${state.packageId}`, { token: adminToken });
  await req('Admin delete service', 'DELETE', `${API}/services/${state.serviceId}`, { token: adminToken });
  await req('Client logout', 'POST', `${API}/auth/logout`, { token: clientToken, body: { refreshToken: data(clientLogin).refreshToken, sessionToken: data(clientLogin).sessionToken } });
  await req('Admin logout', 'POST', `${API}/auth/logout`, { token: adminToken, body: { refreshToken: data(adminLogin).refreshToken, sessionToken: data(adminLogin).sessionToken } });
  log('Socket.IO multi-session runtime', 'BLOCKED', 'No socket.io-client dependency and no frontend socket usage found');

  const failed = results.filter((result) => result.status === 'FAIL');
  const blocked = results.filter((result) => result.status === 'BLOCKED');
  console.log('\nSUMMARY ' + JSON.stringify({ total: results.length, failed: failed.length, blocked: blocked.length, failures: failed, blockedItems: blocked, state }, null, 2));
  if (failed.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
