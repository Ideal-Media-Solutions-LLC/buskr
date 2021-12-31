import handler from '../../handler';
import EventController from '../../db/event';

const defaultDist = Number(process.env.NEXT_PUBLIC_VISIBLE_METERS);

export default handler({
  async GET(req, res) {
    const center = { lng: req.numParam('lng'), lat: req.numParam('lat') };
    const dist = req.intParam('dist', defaultDist);
    const from = req.dateParam('from');
    const to = req.dateParam('to');

    const suggestions = await EventController.getSuggestions({
      center,
      dist,
      from,
      to,
    });

    res.status(200).json(suggestions);
  },
});
