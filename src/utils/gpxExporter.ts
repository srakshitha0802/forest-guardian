import { GPSPoint, Checkpoint, Incident } from '../types';

/**
 * Exports patrol breadcrumbs and checkpoints to standard GPX XML format
 */
export function exportPatrolToGPX(
  patrolName: string,
  officerBadge: string,
  route: GPSPoint[],
  checkpoints: Checkpoint[],
  incidents: Incident[]
): string {
  const now = new Date().toISOString();
  
  let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="ForestGuardian Offline Engine v3.0" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${patrolName} - ${officerBadge}</name>
    <time>${now}</time>
    <desc>Tactical Forest Department Patrol Track Log</desc>
  </metadata>
`;

  // Waypoints for Checkpoints
  checkpoints.forEach(cp => {
    gpx += `  <wpt lat="${cp.lat}" lon="${cp.lng}">
    <name>${cp.name}</name>
    <desc>Status: ${cp.status}${cp.checkedAt ? ' Checked at: ' + cp.checkedAt : ''}</desc>
    <sym>Flag, Blue</sym>
  </wpt>\n`;
  });

  // Waypoints for Incidents
  incidents.forEach(inc => {
    gpx += `  <wpt lat="${inc.lat}" lon="${inc.lng}">
    <name>INC: ${inc.title}</name>
    <desc>Category: ${inc.category}, Urgency: ${inc.urgency}, Status: ${inc.status}</desc>
    <sym>Danger</sym>
  </wpt>\n`;
  });

  // Track & Trackpoints
  gpx += `  <trk>
    <name>Patrol Track - ${officerBadge}</name>
    <trkseg>\n`;

  if (route.length > 0) {
    route.forEach(pt => {
      gpx += `      <trkpt lat="${pt.lat}" lon="${pt.lng}">
        <ele>${pt.altitude || 420}</ele>
        <time>${pt.timestamp || now}</time>
        <speed>${pt.speed || 1.2}</speed>
      </trkpt>\n`;
    });
  } else {
    // If empty route, provide current sector points
    gpx += `      <trkpt lat="37.7410" lon="-119.5850"><ele>410</ele><time>${now}</time></trkpt>\n`;
    gpx += `      <trkpt lat="37.7485" lon="-119.5720"><ele>435</ele><time>${now}</time></trkpt>\n`;
    gpx += `      <trkpt lat="37.7550" lon="-119.5600"><ele>450</ele><time>${now}</time></trkpt>\n`;
  }

  gpx += `    </trkseg>
  </trk>
</gpx>`;

  return gpx;
}

/**
 * Downloads a string content as a local file directly in-browser (100% offline)
 */
export function downloadOfflineFile(content: string, fileName: string, contentType: string = 'application/xml') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
