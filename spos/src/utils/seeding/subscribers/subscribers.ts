import { Subscriber } from '../../../models/Subscriber';
import { SubscriberRepository } from '../../../repositories/SubscriberRepository';

export const subscribers = async () => {
  const sub1 = new Subscriber();
  sub1.id = 'TransactionBased';
  sub1.events = ['custom.transaction'];
  sub1.objects = ['*'];
  sub1.code =
    '(products)=> {\n  const res = {}\n  const minutes = 1;\n  const ts1 = new Date(Date.now() - minutes * 2 * 1000 * 60);\n  const ts2 = new Date(Date.now() - minutes * 1000 * 60);\n  \n  for(const prod of products){\n    const t1 = prod.transactions.filter(t => t.timestamp > ts1).length\n    const t2 = prod.transactions.filter(t => t.timestamp > ts2).length\n    const ot = t1 - t2;\n    const r = Math.floor(Math.random() * 10) / 100;\n    const lp = parseInt(prod.price_points[0].value);\n    console.log(t2)\n    const add = ot <= t2 ? lp * r : -lp*r;  \n    res[prod.id] = lp + add;\n  }\n  return res;\n}';

  await SubscriberRepository.create(sub1);
  await SubscriberRepository.save(sub1);

  const sub2 = new Subscriber();
  sub2.id = 'PseudoRandom';
  sub2.events = ['custom.random'];
  sub2.objects = ['*'];
  sub2.code =
    '(products)=> {\n  const res = {}\n  for(const prod of products){\n    const m = Math.floor((Math.random() / 10 * parseInt(prod.price_points[0].value)) * 10) / 10;\n    const add = Math.random() < 0.5 ? -m : m;\n    res[prod.id] = parseInt(prod.price_points[0].value) + add;\n  }\n  return res;\n}';

  await SubscriberRepository.create(sub2);
  await SubscriberRepository.save(sub2);
};
