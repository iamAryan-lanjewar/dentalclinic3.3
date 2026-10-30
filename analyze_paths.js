const fs = require('fs');

function analyze(file) {
  console.log('===', file, '===');
  const svg = fs.readFileSync(file, 'utf8');
  const matches = [...svg.matchAll(/d="([^"]+)"\s+fill="([^"]+)"/g)];
  matches.forEach((p, idx) => {
    const nums = p[1].match(/-?\d+(\.\d+)?/g).map(Number);
    let minX=Infinity, maxX=-Infinity, minY=Infinity, maxY=-Infinity;
    for(let i=0; i<nums.length; i+=2) {
      if(nums[i]<minX) minX=nums[i];
      if(nums[i]>maxX) maxX=nums[i];
      if(nums[i+1]<minY) minY=nums[i+1];
      if(nums[i+1]>maxY) maxY=nums[i+1];
    }
    console.log('  Path', idx, p[2], {minX: Math.round(minX), maxX: Math.round(maxX), minY: Math.round(minY), maxY: Math.round(maxY), w: Math.round(maxX-minX), h: Math.round(maxY-minY)});
  });
}

analyze('public/images/icon-cross.svg');
analyze('public/images/icon-tooth.svg');
analyze('public/images/icon-heart.svg');

