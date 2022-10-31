import { Subscriber } from '../../../models/Subscriber';
import { SubscriberRepository } from '../../../repositories/SubscriberRepository';

export const subscribers = async () => {
  const sub = new Subscriber();
  sub.id = 'test';
  sub.events = ['test.never_executed'];
  sub.objects = ['*'];
  sub.code = "";
  await SubscriberRepository.create(sub);
  await SubscriberRepository.save(sub);
};
