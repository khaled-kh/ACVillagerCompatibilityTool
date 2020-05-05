import sys
import json
import os.path

# Animal Crossing Compatibility Utility
# Doc: https://nookipedia.com/wiki/Compatibility
# Author: Khaled A Alkhunifer, 2020
# Version: 1.0

def getElemIndex(s):
	if s in ['Aries','Leo','Sagittarius']: return 1
	elif s in ['Taurus','Virgo','Capricorn']: return 2
	elif s in ['Gemini','Libra','Aquarius']: return 3
	elif s in ['Cancer','Scorpio','Pisces']: return 4
	else: return 0

def getElement(s):
	return ['','Fire','Earth','Water','Air'][getElemIndex(s)]

def getSignCompat(a,b):
	i = getElemIndex(a)
	j = getElemIndex(b)
	if (i == 0 or j == 0): return '?'
	elif (i == j): return '♥'
	elif (i%2 == j%2): return '×'
	else: return '♦'

def getSpeciesCompat(a,b):
	if (a == b): return '♦'
	elif (a in['Bear','Cub'] 
		and b in['Bear','Cub']): return '♥'
	elif (a in['Bull','Cow'] 
		and b in['Bull','Cow']): return '♥'
	elif (a in['Cat','Tiger'] 
		and b in['Cat','Tiger']): return '♥'
	elif (a in['Dog','Wolf'] 
		and b in['Dog','Wolf']): return '♥'
	elif (a in['Goat','Sheep'] 
		and b in['Goat','Sheep']): return '♥'
	elif (a in['Kangaroo','Koala'] 
		and b in['Kangaroo','Koala']): return '♥'
	elif (a in['Deer','Horse'] 
		and b in['Deer','Horse']): return '♦'
	elif (a in['Hamster','Squirrel'] 
		and b in['Hamster','Squirrel']): return '♦'
	elif (a in['Hamster','Mouse'] 
		and b in['Hamster','Mouse']): return '♦'
	elif (a in['Mouse','Squirrel'] 
		and b in['Mouse','Squirrel']): return '♦'
	elif (a in['Cat','Mouse'] 
		and b in['Cat','Mouse']): return '×'
	elif (a in['Cat','Hamster'] 
		and b in['Cat','Hamster']): return '×'
	elif (a in['Dog','Gorilla'] 
		and b in['Dog','Gorilla']): return '×'
	elif (a in['Dog','Monkey'] 
		and b in['Dog','Monkey']): return '×'
	elif (a in['Sheep','Wolf'] 
		and b in['Sheep','Wolf']): return '×'
	else: return '♣'

personalityIndex = {
	'Normal': 0,'Lazy': 1,'Peppy': 2,
	'Jock': 3,'Snooty': 4,'Cranky': 5,
	'Smug': 6,'Sisterly': 7}

personalityMatrix = [
	['♣','×','×','♦','♥','♣','♥','♦'],
	['×','♥','♦','×','♣','♦','♣','♥'],
	['×','♦','♥','♥','♦','×','♣','♣'],
	['♦','×','♥','♥','×','♣','♦','♣'],
	['♥','♣','♦','×','♣','♥','♦','×'],
	['♣','♦','×','♣','♥','♥','×','♦'],
	['♥','♣','♣','♦','♦','×','♥','×'],
	['♦','♥','♣','♣','×','♦','×','♥']]

def getPersonalityCompat(a,b):
	i = personalityIndex[a]
	j = personalityIndex[b]
	return personalityMatrix[i][j]

def getCompatibility(a,b):
	return [getSignCompat(a['Sign'],b['Sign']),
		getSpeciesCompat(a['Species'],b['Species']),
		getPersonalityCompat(a['Personality'],b['Personality'])]

def getConsensus(r):
	if (r.count('♥') > 1): return 'Good'
	elif (r.count('♥') == 1 
		and r.count('♦') > 0 
		and r.count('×') == 0): return 'Good'
	elif (r.count('×') > 1): return 'Bad'
	else: return 'Average'

score = { '♥': 5, '♦': 3, '♣': 2, '×': 1 }

def getScore(r):
	s = 0
	for x in r:
		s = s + score[x]
	return s

def getData(file):
	with open(file) as f:
		data = json.load(f)
	return data

def getVillager(name,data):
	for v in data:
		if str(v['Name']).capitalize() == name.capitalize():
			return v
	return None

# app ----------------------------

if len(sys.argv) != 4:
	print('Use: .. <file> <name> <name>')
elif not os.path.isfile(str(sys.argv[1])):
	print('Can\'t find '+str(sys.argv[1]))
else:
	d = getData(str(sys.argv[1]))
	print(str(sys.argv[1])+": "+str(len(d))
	+" villagers data loaded successfully")
	a = getVillager(str(sys.argv[2]),d)
	b = getVillager(str(sys.argv[3]),d)

	if a is None:
		print('Can\'t find villager with name: '
			+ str(sys.argv[2]).capitalize())
	elif b is None:
		print('Can\'t find villager with name: '
			+ str(sys.argv[3]).capitalize())
	else:
		r = getCompatibility(a,b)
		print(a['Name'].capitalize()+" + "
			+b['Name'].capitalize()+" = ["
			+','.join(r)+"] (Relationship: "+getConsensus(r)
			+", Score: "+str(getScore(r))+")")
