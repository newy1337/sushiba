
cd sushiba
git pull origin master
pnpm install
pnpm build
pm2 restart sushiba-back
