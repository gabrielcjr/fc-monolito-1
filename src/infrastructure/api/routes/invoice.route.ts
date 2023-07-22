import express, { Request, Response } from 'express';
import InvoiceFacadeFactory from '../../../modules/invoice/factory/facade.factory';
import { FindInvoiceFacadeInputDto } from '../../../modules/invoice/facade/invoice.facade.interface';

export const invoiceRoute = express.Router();

invoiceRoute.get('/', async (req: Request, res: Response) => {
  const invoiceFacade = InvoiceFacadeFactory.create()
  try {
    const invoiceDto: FindInvoiceFacadeInputDto = {
      id: req.body.id
    };
    const output = await invoiceFacade.findInvoice(invoiceDto);
    res.send(output);
  } catch (err) {
    console.log({ err })
    res.status(500).send(err);
  }
});