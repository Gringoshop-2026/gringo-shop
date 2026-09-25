import { createQuote } from '../../domain/entities/Quote.mjs'
export const createQuoteUseCase = (repository, input) => repository.addQuote(createQuote(input))
