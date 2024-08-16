const { execSync } = require('child_process');

// Function to get the Tailscale binary path
function getTailscaleBinary() {
  try {
    // Try to find Tailscale in the system path
    return execSync('which tailscale').toString().trim();
  } catch (e) {
    // If not found and on macOS, try the default macOS path
    if (process.platform === 'darwin') {
      const macosPath = '/Applications/Tailscale.app/Contents/MacOS/Tailscale';
      try {
        execSync(`test -x ${macosPath}`);
        return macosPath;
      } catch (e) {
        console.error('Tailscale binary not found');
        process.exit(1);
      }
    } else {
      console.error('Tailscale binary not found');
      process.exit(1);
    }
  }
}

const tailscaleBinary = getTailscaleBinary();

console.log(tailscaleBinary);
