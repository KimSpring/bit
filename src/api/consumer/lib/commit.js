/** @flow */
import { loadConsumer } from '../../../consumer';
import InlineId from '../../../consumer/bit-inline-id';

export default function commitAction({ id, message, force, loader }:
{ id: string, message: string, force: ?bool, loader: any }) {
  return loadConsumer()
    .then(consumer => consumer.commit(InlineId.parse(id), message, force, loader));
}
