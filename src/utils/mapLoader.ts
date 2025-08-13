import { GameMap, Area } from '../types/game';

// Parse XML map data
export const parseMapXML = (xmlString: string): GameMap => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');
  
  const mapElement = doc.querySelector('map');
  if (!mapElement) {
    throw new Error('Invalid map XML: missing map element');
  }

  const mapId = mapElement.getAttribute('id') || 'default';
  const mapName = mapElement.getAttribute('name') || 'Default Map';
  const width = parseInt(mapElement.getAttribute('width') || '800');
  const height = parseInt(mapElement.getAttribute('height') || '600');

  const areas: Area[] = [];
  const areaElements = doc.querySelectorAll('area');
  
  areaElements.forEach((areaElement, index) => {
    const area: Area = {
      id: areaElement.getAttribute('id') || `area-${index}`,
      name: areaElement.getAttribute('name') || `Area ${index + 1}`,
      x: parseInt(areaElement.getAttribute('x') || '0'),
      y: parseInt(areaElement.getAttribute('y') || '0'),
      width: parseInt(areaElement.getAttribute('width') || '100'),
      height: parseInt(areaElement.getAttribute('height') || '100'),
      type: (areaElement.getAttribute('type') as 'public' | 'private') || 'public',
      playerCount: 0,
      starSpawnRate: parseInt(areaElement.getAttribute('starSpawnRate') || '5'),
      color: areaElement.getAttribute('color') || (
        areaElement.getAttribute('type') === 'private' 
          ? 'rgba(168, 85, 247, 0.3)' 
          : 'rgba(59, 130, 246, 0.3)'
      )
    };
    areas.push(area);
  });

  return {
    id: mapId,
    name: mapName,
    width,
    height,
    areas
  };
};

// Load map from file
export const loadMapFromFile = async (mapPath: string): Promise<GameMap> => {
  try {
    const response = await fetch(mapPath);
    if (!response.ok) {
      throw new Error(`Failed to load map: ${response.statusText}`);
    }
    const xmlString = await response.text();
    return parseMapXML(xmlString);
  } catch (error) {
    console.error('Error loading map:', error);
    // Return default map if loading fails
    return getDefaultMap();
  }
};

// Default map fallback
export const getDefaultMap = (): GameMap => {
  return {
    id: 'default',
    name: 'Mapa Padrão',
    width: 800,
    height: 600,
    areas: [
      {
        id: 'central-plaza',
        name: 'Praça Central',
        x: 300,
        y: 250,
        width: 200,
        height: 200,
        type: 'public',
        playerCount: 0,
        starSpawnRate: 5,
        color: 'rgba(59, 130, 246, 0.3)'
      },
      {
        id: 'north-gardens',
        name: 'Jardins do Norte',
        x: 150,
        y: 50,
        width: 180,
        height: 120,
        type: 'public',
        playerCount: 0,
        starSpawnRate: 4,
        color: 'rgba(59, 130, 246, 0.3)'
      },
      {
        id: 'east-caverns',
        name: 'Cavernas do Leste',
        x: 550,
        y: 150,
        width: 150,
        height: 200,
        type: 'private',
        playerCount: 0,
        starSpawnRate: 3,
        color: 'rgba(168, 85, 247, 0.3)'
      },
      {
        id: 'south-fields',
        name: 'Campos do Sul',
        x: 200,
        y: 480,
        width: 300,
        height: 100,
        type: 'public',
        playerCount: 0,
        starSpawnRate: 4,
        color: 'rgba(59, 130, 246, 0.3)'
      },
      {
        id: 'west-woods',
        name: 'Bosque Oeste',
        x: 50,
        y: 300,
        width: 120,
        height: 180,
        type: 'private',
        playerCount: 0,
        starSpawnRate: 2,
        color: 'rgba(168, 85, 247, 0.3)'
      }
    ]
  };
};