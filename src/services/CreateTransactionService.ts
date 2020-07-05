import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface TransactionRequest {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: TransactionRequest): Transaction {
    const types = ['income', 'outcome'];
    const filteredType = types.find(t => t === type); // Filter the types ['income' or 'outcome']
    if (!filteredType) {
      // Verify if this type is one of the two types valid
      throw Error('Error creating transaction, review your values!'); // Throw an error if it's not
    } else if (filteredType === 'outcome') {
      // If the transaction is 'outcome', it means that we need to have a VALID balance to do it (incomes x outcomes)
      const balance = this.transactionsRepository.getBalance();
      if (balance.total - value < 0) {
        // Verify if the total value of the balance (incomes - outcomes) is valid
        throw Error('Your balance is not valid! Cannot do this transaction!');
      } else {
        // Valid balance =>> creates a new transaction
        const transaction = this.transactionsRepository.create({
          title,
          value,
          type,
        });
        return transaction;
      }
    } else {
      const transaction = this.transactionsRepository.create({
        title,
        value,
        type,
      });
      return transaction;
    }
  }
}

export default CreateTransactionService;
