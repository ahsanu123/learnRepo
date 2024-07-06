

function addition(x, y)
  return x + y
end

function stepFunc(value)
  if value > 0
    return 1
  elseif value < 0
    return 0
  else
    return Inf
  end
end


function Tracjectory(x)
  g = 9.8
  v0 = 200
  theta = 45 * pi / 180
  k = 1 / 2
  a = v0 * cos(theta)

  return (((g / (k * a)) + tan(theta)) * x) + (g / k^2 * log(1 - (k / a) * x))
end


function NeedUseFloat(value::Float64)
  return value * 2.97
end

# Lamba In julia Use ->
lambda = x -> x^2 + 23

println(NeedUseFloat(2))

