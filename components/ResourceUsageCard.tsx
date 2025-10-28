import { ServerResourceUsage } from '@/lib/types';
import { formatBytes, formatPercent } from '@/lib/utils';

export default function ResourceUsageCard({
  resourceUsage,
}: {
  resourceUsage: ServerResourceUsage;
}) {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <h2 className="card-title text-2xl">Server Resource Usage</h2>
        <p>
          CPU Usage per Core (avg{' '}
          {formatPercent(
            resourceUsage.cpuPercent.reduce((cpu, total) => cpu + total, 0) /
              resourceUsage.cpuPercent.length
          )}
          ):
        </p>
        <ul className="list-disc list-inside">
          {resourceUsage.cpuPercent.map((usage, index) => (
            <li key={index}>
              Core {index + 1}: {formatPercent(usage)}
            </li>
          ))}
        </ul>
        <p>
          Memory Usage: {formatBytes(resourceUsage.memoryUsageBytes)} /{' '}
          {formatBytes(resourceUsage.memoryLimitBytes)} (
          {formatPercent(
            resourceUsage.memoryUsageBytes / resourceUsage.memoryLimitBytes
          )}
          )
        </p>
      </div>
    </div>
  );
}
