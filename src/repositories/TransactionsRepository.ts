import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    if (this.transactions.length < 1) {
      throw Error('You have no transactions!');
    } else {
      return this.transactions;
    }
  }

  public getBalance(): Balance {
    const incomes: Transaction[] = this.transactions.filter(
      transaction => transaction.type === 'income',
    );

    const outcomes: Transaction[] = this.transactions.filter(
      transaction => transaction.type === 'outcome',
    );

    const incomesValue = incomes.reduce((acc, value) => acc + value.value, 0);
    const outcomesValue = outcomes.reduce((acc, value) => acc + value.value, 0);

    const totalValue = incomesValue - outcomesValue;

    const balance = {
      income: incomesValue,
      outcome: outcomesValue,
      total: totalValue,
    };

    return balance;
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
