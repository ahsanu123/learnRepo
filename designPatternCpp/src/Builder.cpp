#include <iostream>
#include <optional>
#include <string>

using namespace std;

enum eHairColor { BLACK, RED, BROWN, WHITE };

enum eHairStyle {
  LONG,
  SHORT,
  CURLY,
};

class Printable {
public:
  virtual string ToString() = 0;
};

class BaseHero {
public:
  virtual string GetName() = 0;
  virtual int GetAge() = 0;
};

class Mage : BaseHero {
  string GetName() override { return "Mage"; };
  int GetAge() override { return 43; }
};

class Archer : BaseHero {
  string GetName() override { return "Archer"; };
  int GetAge() override { return 42; }
};

class Hero : public Printable {
private:
  optional<eHairStyle> hairStyle;
  optional<eHairColor> hairColor;

public:
  Hero &AddHairColor(eHairColor color) {
    this->hairColor = color;
    return *this;
  }

  Hero &AddHairStyle(eHairStyle style) {
    this->hairStyle = style;
    return *this;
  }
  string ToString() override { return "Hell Yeah.."; }

  optional<eHairColor> GetColor() { return this->hairColor; }
};

int GetAgeOfBaseHero(BaseHero &hero) { return hero.GetAge(); }

int main() {
  auto hero = new Hero();
  auto aHero = new Mage();

  hero->AddHairColor(eHairColor::RED);

  if (hero->GetColor())
    cout << "hero have color" << hero->GetColor().value() << endl;
  else
    cout << "hero doesn't have color";

  return 0;
}
