#include <string>

enum eHairColor { BLACK, RED, BROWN, WHITE };

enum eHairStyle {
  LONG,
  SHORT,
  CURLY,
};

class IBuilder;

class Hero {
private:
  eHairColor hairColor;
  eHairStyle hairStyle;

public:
  std::string ToString() { return "hell yeah"; }
};

class IBuilder {
public:
  virtual IBuilder WithHairColor(eHairColor color) = 0;
  virtual IBuilder WithHairStyle(eHairStyle style) = 0;
  virtual Hero Build() = 0;
};
