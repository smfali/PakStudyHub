import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 1. Detect if we are running in a GitHub Actions environment
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

// 2. Extract the repository name from the environment variable
// GitHub gives this as "username/Pakstudy-Hub"
const repoName = process.env.GITHUB_REPOSITORY 
  ? process.env.GITHUB_REPOSITORY.split('/')[1] 
  : '';

// 🔍 DEBUG LOGS: This will show up in the GitHub Actions terminal
console.log('--- DEBUG INFO ---');
console.log('isGithubActions:', isGithubActions);
console.log('repoName:', repoName);
console.log('Final Base Path:', isGithubActions ? `/${repoName}/` : '/');
console.log('------------------');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 3. Set the base path
  // Local: '/'
  // GitHub: '/Pakstudy-Hub/'
  base: '/Pakstudy-Hub/',
})