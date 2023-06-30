import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface UseCasesProps {
  generateUseCase: UseCaseInterface;
  findUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _generateUseCase: UseCaseInterface;
  private _findUseCase: UseCaseInterface;

  constructor(usecasesProps: UseCasesProps) {
    this._generateUseCase = usecasesProps.generateUseCase;
    this._findUseCase = usecasesProps.findUseCase;
  }

  generateInvoice(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
    return this._generateUseCase.execute(input)
  }

}