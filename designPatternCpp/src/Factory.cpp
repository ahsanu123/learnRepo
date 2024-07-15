#include <iostream>
#include <memory>
#include <string>
using namespace std;

class Coin {
public:
  virtual string GetDescription() = 0;
};

class GoldCoin : public Coin {
public:
  GoldCoin() {}
  string GetDescription() override { return "Making Gold Coin"; }
};

class BronzeCoin : public Coin {
public:
  BronzeCoin() {}
  string GetDescription() override { return "Making Bronze Coin"; }
};

enum CoinType { eGoldCoin, eBronzeCoin };

class CoinFactory {
public:
  static unique_ptr<Coin> MakeCoin(CoinType type) {
    switch (type) {
    case CoinType::eGoldCoin:
      return make_unique<GoldCoin>();
    case CoinType::eBronzeCoin:
      return make_unique<BronzeCoin>();
    }
    throw "invalid type";
  }
};

int main(int argc, char *argv[]) {

  auto goldCoin = CoinFactory().MakeCoin(CoinType::eGoldCoin);
  auto bronzeCoin = CoinFactory().MakeCoin(CoinType::eBronzeCoin);

  cout << goldCoin->GetDescription() << endl;
  cout << bronzeCoin->GetDescription() << endl;
  return 0;
}
