import os
from typing import List
from groq import Groq
import argparse
import re

MAX_INPUT_LENGTH=12

def main():
  parser=argparse.ArgumentParser()
  parser.add_argument("--input","-i",type=str,required=True)
  args=parser.parse_args()
  user_input=args.input
  print(f"user input: {user_input}")
  if validate_length(user_input):
    generate_branding_snippet(user_input)
    generate_keyword(user_input)
  else:
    raise ValueError(f"Input length is too long. Must be under {MAX_INPUT_LENGTH}. Submitted input is {user_input}")
  
def validate_length(prompt: str)->bool:
  return len(prompt)<=MAX_INPUT_LENGTH

def generate_keyword(prompt: str)->List[str]:
  client = Groq()
  enriched_prompt=f"Write related branding keywords for {prompt}"
  print(enriched_prompt)

  completion = client.chat.completions.create(
      model="llama-3.1-8b-instant",
      messages=[
        { 
          "role": "system", 
          "content": "You are a branding assistant. Respond only with multiple one word branding keywords"
         },
        {
          "role": "user",
          "content": enriched_prompt
        }
      ],
      temperature=0.6,
      max_completion_tokens=32,
      top_p=1,
      stream=False,
      stop=None
  )

  #getting llm generated branding text 
  keywords: str=completion.choices[0].message.content
  #removed white space
  keywords=keywords.strip()
  if not keywords:
    return "No branding keywords generated..."
  
  #splitting according to symbol using regex
  keywords_array=re.split(",|\n|\*|-",keywords)
  keywords_array=[k.lower().strip() for k in keywords_array]
  
  #making sure no empty strings
  keywords_array=[k for k in keywords_array if len(k)>0]
  print(f"Keywords: {keywords_array}")
  return keywords_array

def generate_branding_snippet(prompt: str)->str:
  client = Groq()
  enriched_prompt=f"Write a branding tagline for {prompt}"
  print(enriched_prompt)
  completion = client.chat.completions.create(
      model="llama-3.1-8b-instant",
      messages=[
        { 
          "role": "system", 
          "content": "You are a branding assistant. Respond only with one upbeat taglines. Make it long."
         },
        {
          "role": "user",
          "content": enriched_prompt
        }
      ],
      temperature=0.88,
      max_completion_tokens=32,
      top_p=1,
      stream=False,
      stop=None
  )

  #getting llm generated branding text 
  branding_message: str=completion.choices[0].message.content
  #removed white space
  branding_message=branding_message.strip()
  #Checked last char punctuation
  if not branding_message:
    return "No branding tagline generated..."
  last_char=branding_message[-1]
  if last_char!="\"":
    branding_message+="...\""
  branding_message=branding_message.strip("\"")
  print(f"Results: {branding_message}")
  return branding_message

if __name__=="__main__":
  main()