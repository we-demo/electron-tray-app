import { $ } from 'execa';
import { updateTray } from '../modules/tray';

let diskSpace = '' // not ready

setInterval(updateSpace, 1000*15)
updateSpace()

export function getDiskSpace() {
  return diskSpace
}

async function updateSpace() {
  const {stdout} = await $`df -kP`; // KB & simpler output
  // Print command's output
  // console.log('stdout', stdout);
  const lines = stdout.trim().split(/\s*\n+\s*/)

  // find main line & fields
  let mainFields = null
  let maxUsed = -1
  for (const line of lines) {
    const fields = line.split(/\s+/)
    if (fields.length) {
      // ζ df -P
      // Filesystem     512-blocks      Used Available Capacity  Mounted on
      // /dev/disk1s5s1  489620264  30113008  21751568    59%    /
      // devfs                 379       379         0   100%    /dev
      // /dev/disk1s4    489620264   4197384  21751568    17%    /System/Volumes/VM
      // /dev/disk1s2    489620264   3728552  21751568    15%    /System/Volumes/Preboot
      // /dev/disk1s6    489620264     12720  21751568     1%    /System/Volumes/Update
      // /dev/disk1s1    489620264 427356696  21751568    96%    /System/Volumes/Data
      // map auto_home           0         0         0   100%    /System/Volumes/Data/home
      const used = Number(fields[2])
      if (used > maxUsed) {
         maxUsed = used
         mainFields = fields
      }
    }
  }
  if (!mainFields) throw new Error('mainFields not found')

  // get remaining space
  const available = Number(mainFields[3])
  const total = maxUsed + available
  const percent = (available / total * 100).toFixed(1) + '%'
  const avail = available < 1024 ? `${available.toFixed(1)}K` :
      available < 1024*1024 ? `${(available/1024).toFixed(1)}M` :
      `${(available/1024/1024).toFixed(1)}G`
  // diskSpace = `${avail},${percent}`
  // diskSpace = ` [${avail} ${percent}]`
  // diskSpace = ` [ ${avail} ${percent} ]`
  diskSpace = ` ${avail}, ${percent}`
  console.log('diskSpace', diskSpace)
  updateTray()
}
