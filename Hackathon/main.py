#importing necessary modules 
from fastapi import FastAPI, HTTPException,Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.responses import HTMLResponse,FileResponse

import re
import nltk 
from nltk import sent_tokenize
from nltk.corpus import words
import pandas as pd 
import openai
import json
import language_tool_python
tool = language_tool_python.LanguageToolPublicAPI('en-US')
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from sqlalchemy import create_engine, Column, Integer, VARCHAR
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select

db_user = 'postgres'
db_password = 'proshort123'
db_host = 'localhost'
db_port = '5432'
db_name = 'ent_fapi'

engine = create_engine(f'postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}')
Base = declarative_base()

class submissions(Base):
    __tablename__ = 'submissions'
    name = Column(VARCHAR(255), primary_key=True)
    roll_number = Column(VARCHAR(255))
    data = Column(VARCHAR(255))
    
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/submission-api")
async def submission_api(data: dict):
    try:
        name = data.get('name')
        roll_number = data.get('rollNumber')
        textAreaValue = data.get('textAreaValue')

        new_login = submissions(name=name, roll_number=int(roll_number), data=textAreaValue)
        
        session.add(new_login)
        session.commit()
        return {'message': 'Submission successful'}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/get-submissions", response_class=JSONResponse)
async def get_all_submissions():
    try:
        # Retrieve all submissions from the database
        all_submissions = session.query(submissions).all()

        # Convert submissions to a list of dictionaries
        submissions_data = [
            {
                'name': submission.name,
                'roll_number': submission.roll_number,
                'textAreaValue': submission.data  # Corrected this line
            }
            for submission in all_submissions
        ]

        # Return the submissions as a JSON response
        print(submissions_data)
        return {'submissions': submissions_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/grammar_correct")
async def check_grammar(text_data:dict):
    sentence = text_data.get("text", "")
    try:     
        errors = []
        sentences = tokenize_sentences(sentence)     
        for sentence in sentences:
            suggestions = tool.check(sentence)            
            for mistake in suggestions:
                error_info = {
                'sentence':sentence,
                'error': sentence[mistake.offset:mistake.offset + mistake.errorLength],
                'suggestions': mistake.replacements
                }
                errors.append(error_info)
        response_data = {'errors': errors}
        return JSONResponse(content=response_data, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.post('/similar_text_class')
async def check_similar(text_data: dict):
    text1 = text_data.get("text1", "")
    
    # Retrieve all submissions from the database
    all_submissions = session.query(submissions).all()

    # Initialize variables to store the most similar text, its name, and similarity percentage
    most_similar_text = ""
    most_similar_name = ""
    max_similarity_percentage = 0.0

    # Iterate through all submissions to find the most similar text
    for submission in all_submissions:
        text2 = submission.data
        similarity_percentage = calculate_similarity(text1, text2)

        # Update if the current text has a higher similarity percentage
        if similarity_percentage > max_similarity_percentage:
            max_similarity_percentage = similarity_percentage
            most_similar_text = text2
            most_similar_name = submission.name

    # Return the most similar text, its name, and similarity percentage
    return JSONResponse(content={
        "most_similar_name": most_similar_name,
        "most_similar_text": most_similar_text,
        "overall_similarity": max_similarity_percentage
    }, status_code=200)
  
    
@app.post("/similar_text")

async def check_similarity(text_data: dict):
    text1 = text_data.get("text1", "")
    text2 = text_data.get("text2", "")

    if not text1 or not text2:
        raise HTTPException(status_code=400, detail="Both texts must be provided.")

    input_sentence_tokenized1 = sent_tokenize(text1)
    input_sentence_tokenized2 = sent_tokenize(text2)
    overall_similarity = calculate_similarity(text1,text2)
    similar_sentences = []

    for i in input_sentence_tokenized1:
        for j in input_sentence_tokenized2:
            similarity = calculate_similarity(i, j)
            if similarity >= 60:  # 60%threshold
                similar_sentences.append((i, j))
    return JSONResponse(content={"overall_similarity": overall_similarity, "similar_sentences": similar_sentences}, status_code=200)

    # return similar_sentences

def calculate_similarity(text1, text2):    
    vectorizer = CountVectorizer()
    vectorizer.fit([text1, text2])

    # texts to vectors
    vector1 = vectorizer.transform([text1]).toarray()
    vector2 = vectorizer.transform([text2]).toarray()

    # cosine similarity 
    similarity = cosine_similarity(vector1, vector2)[0, 0]
    
    # Converting cosine smilarity to percentage
    similarity_percentage = similarity * 100

    return similarity_percentage


def tokenize_sentences(text):
       
    text = text.replace('.', '. ')
    sentences = sent_tokenize(text)

    return sentences

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)