#include <iostream>
#include <string>
#include <unordered_map>

int main(int argc, char *argv[]) {
  std::unordered_map<std::string, std::string> color = {{"red", "#FF0000"},
                                                        {"green", "#FF0000"}};

  auto printKeyValue = [](const auto &key, const auto &value) {
    std::cout << "Key:[" << key << "] Value:[" << value << "]\n";
  };

  for (const std::pair<const std::string, std::string> &val : color) {
    printKeyValue(val.first, val.second);
  }

  std::cout << "Print Key Value Using Structured Binding" << std::endl;
  for (const auto &[key, value] : color) {
    printKeyValue(key, value);
  }

  return 0;
}
