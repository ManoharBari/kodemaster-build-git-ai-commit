import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function getStagedDiff(): Promise<string> {
  try {
    const { stdout } = await execAsync('git diff --cached');
    return stdout;
  } catch (error) {
    console.error('Error reading git diff:', error);
    return '';
  }
}