import type { LocalizedText } from './contracts.ts';

/**
 * Everyday-language search aliases per scene: how a student would describe
 * the scene in plain words or metaphors, deliberately unlike the title.
 * Build-only data: src/search-index.ts folds these into the emitted search
 * index, and the semantic vector builder embeds them with the summary, so a
 * metaphor query ("a set fenced in") can find its scene by similarity.
 * Aliases are never rendered on a page.
 */
export const SCENE_ALIASES: Record<string, LocalizedText> = {
  'logic-propositions': {
    ko: '참인지 거짓인지 따지는 표, 문장끼리 같은 뜻인지 확인',
    en: 'a table that checks true or false, telling whether two sentences mean the same',
  },
  quantifiers: {
    ko: '모든 이라는 말과 어떤 이라는 말, 상대가 뭘 내도 답할 수 있는 게임',
    en: 'the words for all and for some, a game where you must answer whatever is played',
  },
  'direct-proof': {
    ko: '가정에서 곧장 결론까지 가는 증명, 우회 없이 바로 증명',
    en: 'walking straight from the assumption to the conclusion, a proof with no detour',
  },
  contrapositive: {
    ko: '뒤집어서 증명하는 법, 정면으로 안 될 때 거꾸로 증명',
    en: 'proving by flipping the statement, going backwards when the front way is blocked',
  },
  contradiction: {
    ko: '아니라고 가정했더니 말이 안 되는 증명, 반대쪽을 밀어붙여 모순 찾기',
    en: 'assuming the opposite until it stops making sense, hunting for a contradiction',
  },
  'cases-existence': {
    ko: '경우를 전부 나눠서 하나씩 처리, 어딘가 있다는 것만 보이는 증명',
    en: 'splitting into cases and handling each one, showing something exists without finding it',
  },
  'disproof-iff': {
    ko: '안 되는 예 하나로 주장 깨기, 두 조건이 서로를 부르는 관계',
    en: 'one bad example that breaks a claim, two conditions that each force the other',
  },
  'strong-induction': {
    ko: '앞의 전부 다 가정하는 귀납법, 쪼개진 조각을 모으는 증명',
    en: 'induction that assumes everything before, not just the previous step',
  },
  'relations-equivalence': {
    ko: '같은 편으로 묶는 관계, 나머지가 같으면 같은 묶음',
    en: 'grouping things that are on the same team, same remainder means same group',
  },
  'function-proofs': {
    ko: '함수 두 개 이어 붙인 것의 성질, 합성이 단사이면 앞 함수도 단사',
    en: 'chaining two functions together, what the chain forces on each link',
  },
  'natural-numbers': {
    ko: '도미노처럼 넘어가는 증명, 수 세기의 출발점',
    en: 'proof like dominoes falling, where counting numbers come from',
  },
  binomial: {
    ko: '거듭제곱 펼치면 나오는 계수 삼각형, 몇 개 중 몇 개 고르는 경우의 수',
    en: 'the triangle of coefficients when you expand a power, ways to choose some from many',
  },
  'integers-rationals': {
    ko: '쌍으로 새 수를 만드는 법, 음수와 분수를 정의하는 법',
    en: 'building new numbers out of pairs, defining negatives and fractions',
  },
  'absolute-value': {
    ko: '0에서 얼마나 떨어졌나, 부호를 벗긴 수의 크기',
    en: 'how far a number is from zero, size with the sign stripped off',
  },
  'complex-numbers': {
    ko: '평면 위의 점인 수, 실수 축과 허수 축',
    en: 'numbers that are points on a plane, a real axis and an imaginary axis',
  },
  'sqrt2-irrational': {
    ko: '분수로 못 만드는 수, 수직선의 메워지지 않는 구멍',
    en: 'a number no fraction can make, a hole in the number line fractions cannot fill',
  },
  'density-of-rationals': {
    ko: '아무리 좁아도 분수가 숨어 있는 구간, 두 수 사이에 항상 있는 분수',
    en: 'a fraction hiding in every gap however small, always a fraction between two numbers',
  },
  sets: {
    ko: '겹치는 부분과 합친 부분 그림, 일대일 대응인지 따지는 법',
    en: 'overlapping parts and merged parts in a picture, checking one-to-one matching',
  },
  'axiom-of-choice': {
    ko: '줄마다 하나씩 고르는 일, 무한히 많은 집합에서 하나씩 뽑기',
    en: 'picking one from every row, choosing from infinitely many sets at once',
  },
  'zorn-lemma': {
    ko: '사슬을 따라 끝까지 올라가기, 더 위가 없는 원소',
    en: 'climbing a chain to the very top, an element with nothing above it',
  },
  supremum: {
    ko: '집합의 가장 낮은 천장, 위로 막힌 집합의 꼭대기',
    en: 'the lowest ceiling over a set, the top of a set that is blocked from above',
  },
  archimedean: {
    ko: '작은 걸음을 반복하면 결국 넘어서는 수, 무한히 작은 수는 없다',
    en: 'tiny steps repeated eventually pass any target, there is no infinitely small number',
  },
  'nth-root': {
    ko: '제곱해서 원하는 수가 되는 점 찾기, 근이 존재한다는 보장',
    en: 'finding the point whose power hits the target, a guarantee that roots exist',
  },
  countable: {
    ko: '한 줄로 번호 매길 수 있는 무한, 실수는 번호를 다 못 매긴다',
    en: 'an infinity you can number in a line, the reals refuse to be numbered',
  },
  'cantor-theorem': {
    ko: '부분집합이 원래 집합보다 항상 크다, 대각선을 뒤집어 새 원소 만들기',
    en: 'subsets always outnumber the set itself, flipping a diagonal to make a new element',
  },
  'groups-fields': {
    ko: '되돌릴 수 있는 움직임의 규칙, 사칙연산이 전부 되는 세계',
    en: 'rules for moves you can undo, a world where all four operations work',
  },
  'ordered-fields': {
    ko: '순서를 넣을 수 없는 수 체계, 양수들의 모임으로 부등식 만들기',
    en: 'a number system that refuses an ordering, inequalities built from the positives',
  },
  'vector-spaces': {
    ko: '더하고 늘이고 줄이는 세계, 겉모습은 달라도 같은 구조',
    en: 'a world of adding and stretching, different looks with the same structure',
  },
  'dimension-rank': {
    ko: '행렬에 눌려 사라지는 차원, 독립적인 방향의 개수',
    en: 'directions crushed flat by a matrix, counting independent directions',
  },
  'epsilon-n': {
    ko: '아무리 좁혀도 꼬리가 전부 들어가는 띠, 목표값에 한없이 가까워지는 수열',
    en: 'a band so narrow the whole tail still fits inside, a sequence creeping onto its target',
  },
  squeeze: {
    ko: '양쪽에서 조여오면 가운데도 따라가는 정리, 샌드위치처럼 낀 수열',
    en: 'squeezed from both sides so the middle must follow, a sequence caught in a sandwich',
  },
  'standard-limits': {
    ko: '1보다 작은 수를 계속 곱하면 0, 거듭제곱근이 다가가는 값',
    en: 'multiplying a small number forever sinks to zero, where roots settle',
  },
  norm: {
    ko: '벡터의 길이를 재는 자, 길이 재는 규칙 세 가지',
    en: 'a ruler for the length of a vector, three rules any length must obey',
  },
  'inner-product': {
    ko: '두 벡터가 얼마나 같은 방향인가, 겹치는 정도를 재는 곱셈',
    en: 'how much two vectors point the same way, a product that measures overlap',
  },
  'sequence-spaces': {
    ko: '수열 자체가 점이 되는 공간, 수열끼리의 거리',
    en: 'a space where each sequence is a single point, distance between sequences',
  },
  'cauchy-schwarz': {
    ko: '내적은 두 길이의 곱을 못 넘는다, 나란할 때 겹침이 최대',
    en: 'the overlap never beats the product of lengths, biggest when parallel',
  },
  holder: {
    ko: '곱해서 더한 값의 천장, 짝을 이루는 두 지수',
    en: 'a ceiling for products added up, two exponents that pair with each other',
  },
  'parallelogram-law': {
    ko: '대각선과 변 사이의 등식, 어떤 노름이 내적에서 왔는지 가리기',
    en: 'an identity tying diagonals to sides, telling which lengths come from an inner product',
  },
  holes: {
    ko: '유리수만으로 다가갔는데 도착지가 무리수, 유리수 세계의 구멍',
    en: 'rationals marching toward a spot that is not rational, a hole in the rational world',
  },
  construction: {
    ko: '구멍을 메워 실수를 실제로 만들기, 실수란 무엇인가의 대답',
    en: 'filling the holes to actually build the real numbers, what a real number is',
  },
  bounded: {
    ko: '울타리 하나로 전부 가둘 수 있는 수열, 울타리처럼 가두는 수열, 항 전체를 한 번에 가두는 수',
    en: 'a sequence one fence can hold entirely, one number that fences in every term',
  },
  subsequence: {
    ko: '순서를 지키며 골라 뽑은 수열, 항을 건너뛰어 만든 새 수열',
    en: 'terms picked out in order, a new sequence made by skipping',
  },
  'bolzano-weierstrass': {
    ko: '갇힌 수열 속에 숨어 있는 수렴 부분수열, 구간을 반으로 접어 찾기',
    en: 'a convergent subsequence hiding inside a trapped sequence, found by halving the interval',
  },
  'monotone-cauchy': {
    ko: '오르기만 하고 막히면 꼭대기에 닿는 수열, 꼬리가 한 점으로 조여드는 수열',
    en: 'a sequence that only climbs must reach its ceiling, tails tightening onto one point',
  },
  'limsup-liminf': {
    ko: '꼬리의 가장 높은 안착점, 수열이 몰리는 위쪽과 아래쪽 끝',
    en: 'the highest settling point of the tail, the top and bottom ends where a sequence gathers',
  },
  'stolz-cesaro': {
    ko: '비율이 버거울 때 증가량 비율로 우회, 수열판 로피탈',
    en: 'when the ratio is too hard, compare the step-by-step growth instead',
  },
  'double-sequences': {
    ko: '격자에 찍힌 값들의 두 방향 극한, 행 극한과 열 극한이 다른 경우',
    en: 'values on a grid with limits in two directions, row limit versus column limit',
  },
  epsdelta: {
    ko: '오차 범위를 먼저 정하고 답하는 약속, 극한의 엄밀한 정의 게임',
    en: 'you name the error first, then I find the range, the strict definition game of limits',
  },
  continuity: {
    ko: '옆에서 다가간 높이와 점의 높이가 같은 함수, 그래프가 끊기지 않는 함수',
    en: 'the height you approach equals the height at the point, a graph with no break',
  },
  thomae: {
    ko: '팝콘처럼 튀는 함수, 유리수에서만 솟는 점들',
    en: 'a function that pops like popcorn, points that jump up only at rationals',
  },
  'continuity-equivalences': {
    ko: '연속인지 세 가지로 확인하는 법, 같은 판정을 다른 말로',
    en: 'three ways to check the same thing, one verdict in three languages',
  },
  'monotone-discontinuities': {
    ko: '오르기만 하는 함수의 점프 지점, 점프밖에 없는 불연속',
    en: 'a function that only climbs can only break by jumping',
  },
  'uniform-continuity': {
    ko: '하나의 간격이 모든 점에서 통하는 연속, 점마다 간격이 달라지면 안 되는 연속',
    en: 'one gap size that works at every point, continuity that cannot depend on the point',
  },
  ivt: {
    ko: '끊기지 않은 길은 중간 높이를 건너뛸 수 없다, 사이 값을 반드시 밟는 정리',
    en: 'an unbroken path cannot skip the heights in between, every middle value gets stepped on',
  },
  evt: {
    ko: '닫힌 구간에서 반드시 닿는 가장 큰 값, 최댓값이 존재한다는 보장',
    en: 'on a closed stretch the biggest value is actually reached, a guarantee the top exists',
  },
  'additive-functions': {
    ko: '합을 그대로 두는 이상한 함수, 유리수에서는 멀쩡하고 무리수에서는 풀리는 함수',
    en: 'a strange function that keeps sums intact, tame on rationals and wild elsewhere',
  },
  uniform: {
    ko: '점마다 따로 기다리기와 한꺼번에 다가가기, 극한에서 끊겨 버리는 곡선들',
    en: 'waiting point by point versus arriving all at once, curves that end up broken',
  },
  opensets: {
    ko: '경계에 붙은 점이 없는 집합, 어느 점 둘레에도 작은 공이 들어가는 집합',
    en: 'a set with no point stuck on its border, every point has room around it',
  },
  clopen: {
    ko: '열려 있으면서 닫혀 있는 집합, 문이자 벽인 집합',
    en: 'a set that is both open and closed, a door that is also a wall',
  },
  connected: {
    ko: '두 조각으로 가를 수 없는 집합, 한 덩어리로 이어진 집합',
    en: 'a set that cannot be split into two separate pieces, one connected lump',
  },
  closure: {
    ko: '닿으려던 점까지 붙여 닫은 집합, 울타리처럼 가두는 집합, 한계 안에 가둘 수 있는 집합',
    en: 'a set closed up by gluing in the points it reaches for, a set a fence can hold',
  },
  compact: {
    ko: '덮개 조각이 유한 개면 충분한 집합, 닫힘과 갇힘의 짝',
    en: 'few covering pieces always suffice, closed and fenced in together',
  },
  'topologist-sine': {
    ko: '0 근처에서 미친 듯이 흔들리는 곡선, 진동이 멈추지 않는 사인 곡선',
    en: 'a curve that wiggles faster and faster near zero, oscillation that never settles',
  },
  'peano-curve': {
    ko: '선 하나로 면을 채우는 곡선, 뱀처럼 접혀 빈틈을 메우는 선',
    en: 'one line that fills a whole square, a curve folding like a snake to leave no gap',
  },
  'metric-spaces': {
    ko: '거리 재는 법을 바꾸면 공 모양이 달라진다, 거리의 규칙 세 가지',
    en: 'change how distance is measured and balls change shape, three rules for distance',
  },
  contraction: {
    ko: '함수가 한 점으로 빨려들어가는 모양, 점들이 하나의 점으로 빨려들어가는 사상, 거리를 일정 비율로 줄이는 함수',
    en: 'everything sucked into a single point, a map that shrinks every distance by the same ratio',
  },
  'baire-category': {
    ko: '구멍 많은 집합은 전체를 못 덮는다, 점을 하나씩 피하고도 남는 점',
    en: 'hole-filled sets cannot cover everything, a point survives dodging countably many',
  },
  'baire-1': {
    ko: '연속함수를 쌓아 만든 끊기는 함수, 점별 극한으로 쌓은 함수',
    en: 'a broken function built by stacking continuous ones, a pointwise limit of nice functions',
  },
  cantor: {
    ko: '가운데를 계속 지워 길이가 0이 된 집합, 지워도 점은 무수히 남는 집합',
    en: 'erasing the middle forever leaves length zero but countless points',
  },
  'fat-cantor': {
    ko: '길이가 절반이나 남는 구멍투성이 집합, 조금씩만 파낸 칸토어 집합',
    en: 'a hole-filled set that still keeps half its length, erasing more gently',
  },
  'cantor-function': {
    ko: '오르는데 거의 모든 곳에서 평평한 계단, 악마의 계단 함수',
    en: 'a staircase that climbs yet stays flat almost everywhere, the devils staircase',
  },
  'arzela-ascoli': {
    ko: '함수 무리에서 수렴하는 줄을 뽑는 조건, 상자에 갇히고 완만하게 흔들리는 함수들',
    en: 'pulling a convergent line out of a crowd of functions, boxed in and gently wobbling',
  },
  'weierstrass-approx': {
    ko: '다항식만으로 모든 곡선 흉내 내기, 울퉁불퉁한 함수를 매끄럽게 근사',
    en: 'imitating any curve with polynomials alone, smoothing a bumpy function',
  },
  'stone-weierstrass': {
    ko: '다항식 아닌 재료로 곡선 흉내 내기, 근사 재료가 갖춰야 할 세 가지',
    en: 'imitating curves with materials other than polynomials, three things the material needs',
  },
  'muntz-szasz': {
    ko: '재료를 몇 개 빼먹어도 근사가 되나, 지수 역수 합이 가르는 근사 가능 여부',
    en: 'skipping some building powers and still approximating, a sum of reciprocals decides',
  },
  harmonic: {
    ko: '항은 0으로 가는데 합은 끝없이 커지는 급수, 아주 느리게 발산하는 합',
    en: 'terms shrink to zero yet the sum grows forever, the slowest divergence',
  },
  'euler-mascheroni': {
    ko: '둘 다 무한히 커지는데 차이는 한 값에 멈추는 상수, 조화수와 로그의 간격',
    en: 'two quantities both grow forever but their gap settles on one number',
  },
  basel: {
    ko: '제곱 역수를 다 더하면 나오는 유명한 값, 계단처럼 쌓여 한 높이에 붙는 합',
    en: 'adding all reciprocal squares lands on a famous number, steps settling onto a height',
  },
  'euler-product': {
    ko: '체로 걸러 소수만 남기는 곱, 합이 소수 전체의 곱과 같은 식',
    en: 'sieving a sum until only primes remain, a sum equal to a product over all primes',
  },
  leibniz: {
    ko: '목표를 번갈아 넘고 밑돌며 조여드는 합, 왔다 갔다 폭이 줄어드는 급수',
    en: 'overshooting and undershooting the target with shrinking swings',
  },
  tests: {
    ko: '이 급수가 수렴하는지 가리는 도구들, 급수 판정 도구상자',
    en: 'a toolbox for telling whether a series converges',
  },
  'integral-test': {
    ko: '막대와 곡선을 포개 급수와 적분의 운명 묶기, 합과 적분이 같이 수렴하고 같이 발산',
    en: 'bars hugging a curve tie a series and an integral to the same fate',
  },
  'raabe-test': {
    ko: '비율이 1에 붙어 버릴 때 쓰는 판정법, 가까워지는 속도까지 재는 판정',
    en: 'the test for when the ratio sticks to 1, measuring the speed of approach',
  },
  'kummer-test': {
    ko: '모든 판정법을 하나로 묶는 틀, 가중치 하나로 판정법 바꾸기',
    en: 'one frame that contains every test, a weight that swaps the test',
  },
  condensation: {
    ko: '항을 두 배 블록으로 묶어 보는 판정법, 블록 합과 원래 급수의 같은 운명',
    en: 'grouping terms into doubling blocks that share the original fate',
  },
  telescoping: {
    ko: '이웃끼리 서로 지워져 처음과 끝만 남는 급수, 쪼개면 사라지는 항들',
    en: 'neighbours cancel each other so only the start and the tail survive',
  },
  geometric: {
    ko: '남은 것의 절반씩 채워 합이 1이 되는 급수, 정사각형을 절반씩 칠하기',
    en: 'filling half of what remains until the square is full and the sum is 1',
  },
  wallis: {
    ko: '유리수 인자를 곱해 원주율에 다가가는 식, 흔들리며 조여드는 곱',
    en: 'multiplying rational factors to close in on pi, a product that wobbles tighter',
  },
  stirling: {
    ko: '엄청나게 큰 팩토리얼을 짐작하는 식, 로그 눈금에서 겹치는 두 곡선',
    en: 'guessing an astronomically large factorial with a simple formula',
  },
  grandi: {
    ko: '합이 1과 0을 영원히 오가는 급수, 안착하지 못하는 합',
    en: 'a sum that flips between 1 and 0 forever and never settles',
  },
  'dirichlet-test': {
    ko: '흔들리는 급수를 가라앉는 가중치로 길들이기, 울타리에 갇힌 부분합과 0으로 가는 가중치',
    en: 'taming a wobbling series with a weight that sinks to zero',
  },
  'abel-test': {
    ko: '수렴하는 급수에 완만한 가중치를 곱하기, 가중치가 0으로 안 가도 되는 판정법',
    en: 'multiplying a convergent series by a gentle weight that need not vanish',
  },
  'double-series': {
    ko: '행으로 더하나 열로 더하나 같은 이중 합, 더하는 순서를 바꿔도 되는 조건',
    en: 'adding a grid by rows or by columns gives the same total',
  },
  'power-series': {
    ko: '중심에서 일정 거리 안에서는 안전한 급수, 수렴하는 동네의 반지름',
    en: 'a series that is safe within a radius of its center and collapses outside',
  },
  'hadamard-gap': {
    ko: '빈칸이 벌어지는 급수는 경계 너머로 못 이어진다, 지수가 두 배씩 뛰는 급수',
    en: 'gaps between terms grow so the series cannot continue past its circle',
  },
  'abel-theorem': {
    ko: '경계에서의 합과 안에서 다가간 극한이 이어지나, 발산 급수에도 매기는 합',
    en: 'the sum at the boundary matches the limit from inside, assigning a sum to a divergent series',
  },
  tauber: {
    ko: '매긴 합이 진짜 합인지 거꾸로 묻기, 조건이 붙어야 돌아오는 정리',
    en: 'asking backwards whether an assigned sum is the real sum, with strings attached',
  },
  eseries: {
    ko: '복리로 다가가기와 급수로 다가가기의 속도 대결, e에 이르는 두 길',
    en: 'two roads to e racing each other, compound interest versus a fast series',
  },
  zeta4: {
    ko: '네제곱 역수를 다 더한 값, 몇 항만으로 답에 붙는 급수',
    en: 'adding all reciprocal fourth powers, a few terms already nail the answer',
  },
  rearrangement: {
    ko: '순서를 바꾸면 합이 밀고 당겨지는 급수, 양의 항과 음의 항을 어느 쪽부터 꺼내나',
    en: 'reordering terms pushes and pulls the sum, positives and negatives in any order you like',
  },
  absolute: {
    ko: '절댓값을 씌워도 수렴하면 끝나는 급수, 부호를 지운 합이 유한한 경우',
    en: 'if the sum survives removing all signs, the story is over',
  },
  'riemann-rearrangement': {
    ko: '순서만 바꿔 원하는 합을 직접 만들기, 탐욕 규칙으로 합 맞추기',
    en: 'building any sum you want just by reordering, a greedy rule that hits the target',
  },
  'cauchy-product': {
    ko: '두 급수를 곱하면 대각선으로 짝지어지는 항들, 급수와 급수의 곱셈',
    en: 'multiplying two series pairs terms along diagonals of a grid',
  },
  'm-test': {
    ko: '각 항을 누르는 상한들로 한 번에 판정, 꼬리가 전 구간에서 동시에 작아지는 조건',
    en: 'one bound per term settles the whole series, tails small everywhere at the same time',
  },
  dini: {
    ko: '단조로운 함수열은 기다림이 한꺼번에 묶인다, 점별수렴이 저절로 균등수렴이 되는 경우',
    en: 'monotone functions make the waiting uniform for free',
  },
  fourier: {
    ko: '둥근 파를 겹쳐 각진 파형 만들기, 점프 옆에 남는 울림',
    en: 'stacking round waves to build a square wave, a ringing that stays by the jump',
  },
  'riemann-lebesgue': {
    ko: '빨리 출렁이면 평균에 지워지는 계수, 진동이 빨라지면 사라지는 푸리에 계수',
    en: 'oscillate fast enough and the average wipes the coefficient out',
  },
  'fejer-theorem': {
    ko: '울리는 부분합들을 평균 내어 가라앉히기, 평균을 내면 혹이 상쇄되는 정리',
    en: 'averaging the ringing partial sums calms them down, bumps cancel in the mean',
  },
  parseval: {
    ko: '함수의 에너지와 계수의 에너지가 같다, 제곱합이 양쪽에서 똑같이 잡히는 식',
    en: 'the energy of a function equals the energy of its coefficients',
  },
  'gibbs-phenomenon': {
    ko: '점프 옆 혹이 줄지 않는 이유, 확대하면 같은 곡선으로 겹치는 혹',
    en: 'why the bump by a jump never shrinks, zoom in and the bump is the same curve',
  },
  'function-spaces': {
    ko: '멀리 가면 사라지는 함수들의 모임, 유계인 연속함수 전체',
    en: 'families of functions that fade away far out, all bounded continuous functions',
  },
  diffcont: {
    ko: '미분되면 끊기지 않지만 그 반대는 아니다, 뾰족한 모서리에서 깨지는 미분',
    en: 'differentiable means unbroken but not the other way, a sharp corner breaks it',
  },
  'discontinuous-derivative': {
    ko: '미분은 되는데 기울기가 진동하는 함수, 함수는 매끄럽고 도함수만 불연속',
    en: 'smooth function whose slope will not stop oscillating',
  },
  mvt: {
    ko: '평균 기울기와 같은 순간 기울기가 반드시 있다, 양 끝을 잇는 직선과 평행한 접선',
    en: 'somewhere the instant slope equals the average slope, a tangent parallel to the chord',
  },
  'derivative-monotonicity': {
    ko: '기울기 부호만 읽으면 아는 오르내림, 접선 색이 부호를 따라가는 곡선',
    en: 'read the sign of the slope and you know the ups and downs',
  },
  'inverse-function-theorem': {
    ko: '함수를 뒤집으면 기울기도 뒤집힌다, 가로와 세로를 맞바꾸기',
    en: 'flip a function and its slope flips too, swapping horizontal and vertical',
  },
  'cauchy-mvt': {
    ko: '함께 움직이는 두 양의 변화 비율, 매개곡선 위의 평행한 접점',
    en: 'two quantities moving together, their ratio of changes matches somewhere',
  },
  lhopital: {
    ko: '0 나누기 0에서 누가 더 빨리 줄어드나, 답이 안 보이는 비율 극한',
    en: 'zero over zero, the winner is whoever shrinks faster',
  },
  darboux: {
    ko: '도함수는 값을 건너뛰어 점프할 수 없다, 불연속이어도 중간을 전부 밟는 도함수',
    en: 'a derivative cannot jump over values, it steps on every height in between',
  },
  'weierstrass-function': {
    ko: '연속인데 어디서도 기울기가 없는 가시 곡선, 확대할수록 새 톱니가 나오는 함수',
    en: 'continuous everywhere with a slope nowhere, new teeth appear at every zoom',
  },
  taylor: {
    ko: '한 점의 정보로 곡선에 달라붙는 다항식, 차수를 올릴수록 정확해지는 흉내',
    en: 'a polynomial that clings to a curve using only one points data',
  },
  'taylor-thm': {
    ko: '근사 오차가 갇히는 띠의 크기, 오차 상한을 미리 보장하는 정리',
    en: 'a band that traps the approximation error, a promised ceiling on the mistake',
  },
  convex: {
    ko: '그릇처럼 아래로 볼록한 곡선, 두 점을 잇는 줄이 그래프 위에 뜨는 함수',
    en: 'a bowl-shaped curve, the string between two points floats above the graph',
  },
  newton: {
    ko: '접선을 타고 내려가 근 찾기, 맞는 자릿수가 두 배로 늘어나는 반복',
    en: 'riding tangent lines down to the root, correct digits doubling each round',
  },
  banach: {
    ko: '거미줄 그림이 한 점으로 빨려들어가는 모양, 한 점으로 빨려드는 반복, 고정점을 찾는 원리',
    en: 'a cobweb sucked into one point, iterating your way to a fixed point',
  },
  gamma: {
    ko: '팩토리얼을 실수까지 매끄럽게 늘인 함수, 한 칸 밀면 그 수가 곱해지는 규칙',
    en: 'factorial stretched smoothly to all real numbers, shift by one and multiply',
  },
  'beta-function': {
    ko: '두 지수가 만드는 봉우리의 넓이, 양 끝에서 다르게 당겨지는 곡선',
    en: 'the area under a hump shaped by two exponents pulling at the ends',
  },
  'bohr-mollerup': {
    ko: '가짜 팩토리얼 확장을 걸러내는 조건, 규칙만으로 함수가 하나로 정해지나',
    en: 'one extra condition filters out fake factorials',
  },
  improper: {
    ko: '무한히 뻗어도 넓이가 유한한 적분, 꼬리가 가늘어지면 멈추는 넓이',
    en: 'an integral stretching forever whose area still stops growing',
  },
  'gabriel-horn': {
    ko: '부피는 유한한데 겉넓이는 무한한 나팔, 채우는 양과 칠하는 양이 갈리는 역설',
    en: 'a horn you can fill but never paint, finite volume with infinite surface',
  },
  riemann: {
    ko: '직사각형으로 곡선 아래 넓이 재기, 아래합과 위합이 양쪽에서 조여오는 넓이',
    en: 'measuring area with rectangles, lower and upper sums squeezing the answer',
  },
  'dirichlet-function': {
    ko: '유리수에서만 1인 지저분한 함수, 적분이 실패하는 대표 반례',
    en: 'a function that is 1 only on rationals, the classic case where integration fails',
  },
  'volterra-function': {
    ko: '미분도 되고 도함수도 갇혔는데 적분이 안 되는 반례, 두꺼운 집합 위에 혹을 올린 함수',
    en: 'differentiable with a trapped derivative that still cannot be integrated',
  },
  ftc: {
    ko: '넓이가 쌓이는 속도가 곧 그 지점의 높이, 미분과 적분이 서로를 되돌리는 정리',
    en: 'area piles up at the speed of the height, differentiation and integration undo each other',
  },
  'integration-by-parts': {
    ko: '곱의 미분 규칙을 거꾸로 돌리는 적분, 어려운 적분을 쉬운 적분으로 바꾸기',
    en: 'the product rule run backwards, trading a hard integral for an easy one',
  },
  'change-of-variables': {
    ko: '축을 늘이고 줄여 구간을 바꾸는 적분, 눈금을 바꾸면 넓이도 보정',
    en: 'stretching the axis to change the interval, rescaling corrects the area',
  },
  'bounded-variation': {
    ko: '함수가 출렁인 총 거리를 재기, 오르내린 양을 전부 더한 합이 유한',
    en: 'the total distance a function wobbles, all the ups and downs added up',
  },
  'arc-length': {
    ko: '개가 뛰어다니는 궤적의 길이, 뛰어다닌 자취의 총 길이, 움직인 경로와 궤적의 길이, 곡선을 곧은 조각으로 나눠 잰 길이',
    en: 'the length of a trajectory, the total length of the path something ran along, a curve measured by straight pieces',
  },
  'riemann-stieltjes': {
    ko: '길이가 아니라 무게로 재는 적분, 한 점에 무게를 몰아넣는 적분',
    en: 'an integral weighed by mass instead of length, all the weight piled on one point',
  },
  'jordan-decomposition': {
    ko: '오른 양과 내린 양을 따로 기록해 나누기, 변동을 두 증가함수의 차이로',
    en: 'recording total climb and total fall separately, variation as a difference of climbs',
  },
  measure: {
    ko: '집합 크기를 재는 가장 싼 덮개 값, 한 점도 유리수 전체도 크기가 0',
    en: 'the cheapest cover prices the size of a set, a point and all rationals cost zero',
  },
  vitali: {
    ko: '크기를 잴 수 없는 집합, 대표를 하나씩 뽑아 만든 잴 수 없는 집합',
    en: 'a set whose size cannot be measured at all, built by picking representatives',
  },
  'borel-cantelli': {
    ko: '무한히 자주 일어나는 일은 거의 없다는 경계, 겹치는 지점이 점점 희귀해지는 정리',
    en: 'events whose total length is finite almost never keep happening',
  },
  lebesgue: {
    ko: '유리수를 하나씩 덮어 넓이를 재는 새 방법, 리만이 못 재는 함수를 재는 적분',
    en: 'covering rationals one by one to measure what the old integral could not',
  },
  'lebesgue-convergence': {
    ko: '극한과 적분 순서를 바꿔도 되는 조건, 질량이 도망가면 깨지는 순서 교환',
    en: 'when limit and integral may swap places, mass escaping breaks the swap',
  },
  'fubini-tonelli': {
    ko: '행부터 더하나 열부터 더하나 같은 이중적분, 적분 순서를 바꿔도 되는 조건',
    en: 'integrating rows first or columns first gives the same answer',
  },
  convolution: {
    ko: '한 함수를 뒤집어 밀며 겹치는 양 재기, 겹치면 각진 함수도 부드러워지는 연산',
    en: 'flip one function, slide it, and measure the overlap, smoothing jagged shapes',
  },
  egorov: {
    ko: '느린 지점을 작은 집합에 몰아넣으면 고르게 수렴, 거의 균등수렴이라는 말',
    en: 'corner the slow points into a tiny set and the rest converges evenly',
  },
  'absolute-continuity': {
    ko: '작은 변화가 큰 출력을 못 만드는 함수, 칸토어 함수에는 없는 성질',
    en: 'tiny inputs cannot make big outputs, a property the cantor function lacks',
  },
  'differentiation-under-integral': {
    ko: '적분 기호 안에서 미분해도 되는가, 전체 미분과 안쪽 미분이 같은 경우',
    en: 'differentiating inside the integral sign instead of outside',
  },
  minkowski: {
    ko: '함수판 삼각부등식, 곧장 가는 길이 두 구간 합을 못 넘는 부등식',
    en: 'the triangle inequality for functions, the direct way never beats the detour sum',
  },
};
