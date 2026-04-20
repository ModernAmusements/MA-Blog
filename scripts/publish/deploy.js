#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const parser = require('./parser');
const medium = require('./medium');
const twitter = require('./twitter');

require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'https://modern-amusements.vercel.app';

const PLATFORMS = {
  medium: 'medium',
  twitter: 'twitter',
  threads: 'twitter',
  all: 'all',
};

const STATUS = {
  draft: 'draft',
  public: 'public',
};

async function log(message, type = 'info') {
  const prefix = {
    info: 'ℹ',
    success: '✓',
    error: '✗',
    warn: '⚠',
  }[type] || '•';
  console.log(`${prefix} ${message}`);
}

async function deployBlogPost(slug, options = {}) {
  const {
    platform = 'all',
    mediumStatus = 'draft',
    twitterStatus = 'all',
    token,
  } = options;

  const post = parser.getBlogPostBySlug(slug);

  if (!post) {
    await log(`Blog post "${slug}" not found`, 'error');
    return { success: false, error: 'Post not found' };
  }

  await log(`Deploying: ${post.title}`);
  await log(`Date: ${post.date}`);
  await log(`Tags: ${post.tags.join(', ')}`);

  const mediumToken = token || process.env.MEDIUM_TOKEN;
  const twitterToken = token || process.env.TWITTER_TOKEN;
  const dryRun = process.env.DRY_RUN === 'true' || options.dryRun;

  const results = {
    medium: null,
    twitter: null,
  };

  if (dryRun) {
    await log('DRY RUN MODE - No posts will be published', 'warn');
    console.log('\n--- Preview ---\n');
    console.log(`Title: ${post.title}\n`);
    console.log(`Tags: ${post.tags.join(', ')}\n`);
    console.log(`URL: ${BASE_URL}/blog/${post.slug}\n`);

    const tweets = parser.generateTwitterThread(post);
    console.log(`Twitter Thread Preview (${tweets.length} tweets):\n`);
    tweets.forEach((tweet, i) => {
      console.log(`Tweet ${i + 1}:`);
      console.log(tweet.substring(0, 280) + (tweet.length > 280 ? '...' : ''));
      console.log();
    });
  }

  if (dryRun) {
      await log('Medium: Skipped (dry run)', 'warn');
    } else if (platform === 'all' || platform === 'medium') {
    if (mediumToken) {
      await log('Posting to Medium...', 'info');

      try {
        const content = parser.convertToMediumFormat(post.content);
        const canonicalUrl = `${BASE_URL}/blog/${post.slug}`;

        const result = await medium.publishToMedium({
          title: post.title,
          content,
          tags: post.tags,
          canonicalUrl,
          token: mediumToken,
          publishStatus: mediumStatus,
        });

        results.medium = result;

        if (result.success) {
          await log(`Medium: ${result.url}`, 'success');
        } else {
          await log(`Medium failed: ${result.error || 'Unknown error'}`, 'error');
        }
      } catch (error) {
        await log(`Medium error: ${error.message}`, 'error');
        results.medium = { success: false, error: error.message };
      }
    } else {
      await log('Medium token not set, skipping...', 'warn');
    }
  }

  if (dryRun) {
      await log('Twitter: Skipped (dry run)', 'warn');
    } else if (platform === 'all' || platform === 'twitter' || platform === 'threads') {
    if (twitterToken) {
      await log('Posting to Twitter/Threads...', 'info');

      try {
        const tweets = parser.generateTwitterThread(post);

        const result = await twitter.postThread({
          tweets,
          token: twitterToken,
        });

        results.twitter = result;

        if (result.success) {
          await log(`Twitter: ${result.results.length} tweets posted`, 'success');
        } else {
          await log(`Twitter failed: ${result.errors?.[0]?.message || 'Unknown error'}`, 'error');
        }
      } catch (error) {
        await log(`Twitter error: ${error.message}`, 'error');
        results.twitter = { success: false, error: error.message };
      }
    } else {
      await log('Twitter token not set, skipping...', 'warn');
    }
  }

  const success = dryRun || results.medium?.success || results.twitter?.success;

  return {
    success,
    post: post.title,
    results,
  };
}

async function listBlogPosts() {
  const posts = parser.getBlogPosts();
  
  console.log('\n📝 Available Blog Posts:\n');
  
  posts.forEach((post, i) => {
    console.log(`${i + 1}. ${post.title}`);
    console.log(`   Date: ${post.date}`);
    console.log(`   Tags: ${post.tags.join(', ')}`);
    console.log(`   Slug: ${post.slug}`);
    console.log();
  });

  return posts;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log(`
📤 Blog Publish Workflow

Usage:
  node scripts/publish/deploy.js list                      List all blog posts
  node scripts/publish/deploy.js deploy <slug>             Deploy to all platforms
  node scripts/publish/deploy.js deploy <slug> --medium    Deploy to Medium only
  node scripts/publish/deploy.js deploy <slug> --twitter  Deploy to Twitter only
  node scripts/publish/deploy.js deploy <slug> --status public  Publish publicly

Options:
  --platform <platform>    medium, twitter, all (default: all)
  --status <status>      draft, public (default: draft)
  --token <token>       API token override

Examples:
  node scripts/publish/deploy.js list
  node scripts/publish/deploy.js deploy dot-matrix-generator
  node scripts/publish/deploy.js deploy german-police-shootings --status public
  node scripts/publish/deploy.js deploy ai-energy-os --platform medium
`);
    process.exit(0);
  }

  if (command === 'list') {
    await listBlogPosts();
    process.exit(0);
  }

  if (command === 'deploy') {
    const slug = args[1];
    
    if (!slug) {
      await log('Please provide a blog post slug', 'error');
      console.log('Usage: node scripts/publish/deploy.js deploy <slug>');
      process.exit(1);
    }

    const options = {
      platform: 'all',
      mediumStatus: 'draft',
      twitterStatus: 'all',
      token: null,
    };

    for (let i = 2; i < args.length; i++) {
      const arg = args[i];
      
      if (arg === '--medium') {
        options.platform = 'medium';
      } else if (arg === '--twitter') {
        options.platform = 'twitter';
      } else if (arg === '--status' && args[i + 1]) {
        options.mediumStatus = args[++i];
      } else if (arg === '--token' && args[i + 1]) {
        options.token = args[++i];
      }
    }

    const result = await deployBlogPost(slug, options);

    if (result.success) {
      await log('Deployment complete!', 'success');
    } else {
      await log('Deployment failed', 'error');
      process.exit(1);
    }

    process.exit(0);
  }

  await log(`Unknown command: ${command}`, 'error');
  process.exit(1);
}

if (require.main === module) {
  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  deployBlogPost,
  listBlogPosts,
};