const cats = ['People', 'Vehicles', 'Furniture', 'Electronics', 'Animals'];
const names = ['office-meeting.jpg', 'street-corner.png', 'team-lunch.webp', 'living-room.jpg', 'park-walk.jpg', 'warehouse.png', 'cafe-table.jpg', 'city-traffic.jpg', 'desk-setup.webp', 'family-dinner.jpg', 'dog-park.jpg', 'conference.png', 'retail-store.jpg', 'kitchen.jpg'];
const hues = [250, 215, 280, 230, 200, 265];
export const seedImages = names.map((name, i) => ({
    id: 'img_' + (i + 1), name, hue: hues[i % 6], url: null,
    uploadedAt: new Date(Date.now() - i * 86400000 * 1.7).toISOString(),
    status: i === 3 ? 'Processing' : i === 8 ? 'Failed' : 'Completed', people: (i * 3) % 6, objects: 3 + (i * 5) % 9, categories: [cats[i % 5], cats[(i + 2) % 5]]
}));
export const mockAnalysis = {
    description: { summary: 'A bright modern office where three colleagues review documents around a table while a laptop and a monitor sit in front of them.', scene: 'Team meeting', environment: 'Indoor office', lighting: 'Soft natural light from a window on the left', quality: 'High (sharp, well exposed)' },
    people: [
        { id: 1, position: 'Left, foreground', age: 'Adult', clothing: 'Navy blazer, white shirt, glasses', activity: 'Standing and pointing at a document' },
        { id: 2, position: 'Center, seated', age: 'Adult', clothing: 'Grey sweater, lanyard', activity: 'Seated, typing on a laptop' },
        { id: 3, position: 'Right, background', age: 'Adult', clothing: 'Black jacket, backpack', activity: 'Holding a coffee cup, looking at the screen' }],
    objects: [
        { name: 'Person', category: 'People', count: 1, confidence: .97, box: [5, 12, 22, 70] },
        { name: 'Person', category: 'People', count: 1, confidence: .95, box: [38, 28, 20, 55] },
        { name: 'Person', category: 'People', count: 1, confidence: .92, box: [70, 15, 20, 60] },
        { name: 'Laptop', category: 'Electronics', count: 1, confidence: .93, box: [36, 58, 22, 18] },
        { name: 'Monitor', category: 'Electronics', count: 1, confidence: .89, box: [60, 40, 14, 18] },
        { name: 'Chair', category: 'Furniture', count: 2, confidence: .84, box: [30, 50, 12, 35] },
        { name: 'Table', category: 'Furniture', count: 1, confidence: .9, box: [22, 62, 52, 25] },
        { name: 'Cup', category: 'Furniture', count: 1, confidence: .78, box: [80, 50, 5, 8] }],
    scene: { setting: 'Indoor', type: 'Office', weather: 'Not applicable (indoor)', lighting: 'Natural daylight through windows' },
    text: ['QUARTERLY REVIEW', 'Q3 Roadmap – Draft v2', 'Meeting Room B']
};
export const suggestions = ['What is happening in this image?', 'How many people are visible?', 'What objects can you identify?', 'Describe the clothing of the people.', 'Is this an indoor or outdoor scene?', 'What text is visible in the image?'];
export function mockAnswer(q) {
    const s = q.toLowerCase(), a = mockAnalysis;
    if (s.includes('how many') || s.includes('people')) return `I can see ${a.people.length} people: one standing on the left, one seated in the center and one in the background on the right.`;
    if (s.includes('object')) return 'Detected objects: ' + a.objects.map(o => `${o.name} (${Math.round(o.confidence * 100)}%)`).join(', ') + '.';
    if (s.includes('cloth') || s.includes('wear')) return a.people.map(p => `Person ${p.id}: ${p.clothing}.`).join(' ');
    if (s.includes('indoor') || s.includes('outdoor')) return `This is an indoor scene: ${a.scene.type.toLowerCase()}, lit by ${a.scene.lighting.toLowerCase()}.`;
    if (s.includes('text')) return 'Visible text: ' + a.text.map(t => `"${t}"`).join(', ') + '.';
    return a.description.summary;
}
