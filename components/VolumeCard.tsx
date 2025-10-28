import { ContainerInfo, VolumeInspectInfo } from 'dockerode';
import NotFoundCard from './NotFoundCard';

export default function VolumeCard({
  volume,
  mount,
}: {
  volume: VolumeInspectInfo;
  mount?: ContainerInfo['Mounts'][number];
}) {
  if (!volume) {
    return <NotFoundCard noun="Volume" />;
  }

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <h3 className="card-title">{mount?.Destination ?? volume.Name}</h3>
        {mount && (
          <>
            <p>Name: {volume.Name}</p>
            <p>Type: {mount.Type}</p>
            <p>Source: {mount.Source === '' ? '(empty)' : mount.Source}</p>
          </>
        )}
        <p>Mountpoint: {volume.Mountpoint}</p>
      </div>
    </div>
  );
}
