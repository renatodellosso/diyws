import { FiWifiOff } from 'react-icons/fi';

export default function DockerOfflineScreen() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <FiWifiOff size={64} />
        <div>Docker is not running</div>
      </div>
    </div>
  );
}
