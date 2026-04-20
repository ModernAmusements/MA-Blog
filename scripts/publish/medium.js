const fs = require('fs');
const path = require('path');
const https = require('https');

async function mediumAPI(endpoint, method, body, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.medium.com',
      path: `/v1/${endpoint}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch {
          resolve(data);
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function getMediumUser(token) {
  const response = await mediumAPI('me', 'GET', null, token);
  return response.data;
}

async function publishToMedium({ title, content, tags, canonicalUrl, token, publishStatus = 'draft' }) {
  const user = await getMediumUser(token);

  const payload = {
    title: title,
    contentFormat: 'html',
    content: content,
    tags: tags,
    canonicalUrl: canonicalUrl,
    publishStatus: publishStatus,
  };

  const response = await mediumAPI(
    `users/${user.id}/posts`,
    'POST',
    payload,
    token
  );

  return {
    success: !!response.data,
    url: response.data?.url,
    id: response.data?.id,
  };
}

async function getMediumPost(postId, token) {
  const response = await mediumAPI(`posts/${postId}`, 'GET', null, token);
  return response.data;
}

async function updateMediumPost(postId, { title, content, tags, token }) {
  const payload = {
    title: title,
    contentFormat: 'html',
    content: content,
    tags: tags,
  };

  const response = await mediumAPI(
    `posts/${postId}`,
    'PUT',
    payload,
    token
  );

  return {
    success: !!response.data,
    url: response.data?.url,
  };
}

module.exports = {
  getMediumUser,
  publishToMedium,
  getMediumPost,
  updateMediumPost,
};