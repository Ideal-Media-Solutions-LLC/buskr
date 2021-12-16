import handler, { HttpException } from '../../handler';
import EventController from '../../../db/event';

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
const GET = async function GET(req, res) {
  const id = req.intParam('id');
  const limit = req.intParam('limit', null);
  const offset = req.intParam('offset', null);
  const event = await EventController.get(id, limit, offset);
  if (event === undefined) {
    throw new HttpException(404, 'Event not found', id);
  }
  res.status(200).json(event);
};

export default handler({ GET });
