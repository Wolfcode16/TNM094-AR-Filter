import cv2
import matplotlib.pyplot as plt
import json
from deepface import DeepFace
#using tensorflow in backend
import threading
from collections import Counter

emotions = []
#ages = []

framecount = 0

def process_frame(frame) :


    if framecount % 10 == 0 :
        #print(newTime - previousTime)
        try :
            analysis = DeepFace.analyze(frame, actions=["age"])
            print(analysis[0]['age'])
            # if not ages:
            #     analysis = DeepFace.analyze(frame, actions=["gender"])
            #     print(analysis[0]['gender'])
            #     ages.append(analysis[0]['gender'])

            emotions.append(analysis[0]['age'])
        except Exception as e:
            print(f"Error processing frame: {e}")

def capture_and_display():
    cap = cv2.VideoCapture(0)  # Use 0 for webcam, or provide video file path
    #cap = cv2.VideoCapture('testVideo.mp4')

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Display the frame
        cv2.imshow('Video', frame)

        # Start a new thread for processing the frame
        threading.Thread(target=process_frame, args=(frame,)).start()


        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

#call the function
capture_and_display()

if emotions  :
    WordCount = Counter(emotions)
    print(WordCount)
    most_common_word, max_count = WordCount.most_common(1)[0]
# if ages:
#     AgeCount = Counter(ages)
#     most_common_age, max_age = AgeCount.most_common(1)[0]

    user = {
         "emotion": most_common_word,
        #"age": most_common_age
    }

    json_object = json.dumps(user, indent=4)
    print(json_object)

    with open("test.json", "w") as outfile:
        outfile.write(json_object)