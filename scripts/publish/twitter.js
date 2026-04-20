const https = require('https');
const { URL } = require('url');

async function twitterAPI(endpoint, method, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, 'https://api.twitter.com');
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
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

async function getTwitterMe(token) {
  const response = await twitterAPI('https://api.twitter.com/2/users/me', 'GET', null, token);
  return response.data;
}

async function postTweet({ text, token }) {
  const response = await twitterAPI(
    'https://api.twitter.com/2/tweets',
    'POST',
    { text },
    token
  );

  return {
    success: !response.errors,
    id: response.data?.id,
    text: response.data?.text,
    errors: response.errors,
  };
}

async function postThread({ tweets, token }) {
  const results = [];
  let inReplyTo = null;

  for (const tweetText of tweets) {
    const payload = inReplyTo 
      ? { text: tweetText, reply: { in_reply_to_tweet_id: inReplyTo } }
      : { text: tweetText };

    const response = await twitterAPI(
      'https://api.twitter.com/2/tweets',
      'POST',
      payload,
      token
    );

    if (response.errors) {
      return {
        success: false,
        errors: response.errors,
        results,
      };
    }

    results.push({
      id: response.data?.id,
      text: response.data?.text,
    });

    inReplyTo = response.data?.id;
  }

  return {
    success: true,
    results,
  };
}

async function deleteTweet(tweetId, token) {
  const response = await twitterAPI(
    `https://api.twitter.com/2/tweets/${tweetId}`,
    'DELETE',
    null,
    token
  );

  return {
    success: !response.errors,
  };
}

async function uploadMedia({ media, token }) {
  const formData = new FormData();
  formData.append('media', media);

  const response = await twitterAPI(
    'https://upload.twitter.com/1.1/media/upload.json',
    'POST',
    formData,
    token
  );

  return {
    success: !response.errors,
    mediaId: response.media_id_string,
  };
}

async function postTweetWithMedia({ text, mediaIds, token }) {
  const response = await twitterAPI(
    'https://api.twitter.com/2/tweets',
    'POST',
    { text, media: { media_ids: mediaIds } },
    token
  );

  return {
    success: !response.errors,
    id: response.data?.id,
    errors: response.errors,
  };
}

module.exports = {
  getTwitterMe,
  postTweet,
  postThread,
  deleteTweet,
  uploadMedia,
  postTweetWithMedia,
};