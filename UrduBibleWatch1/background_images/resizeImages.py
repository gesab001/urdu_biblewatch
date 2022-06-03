import os
import subprocess
from os.path import exists


categories = os.listdir()
categories.sort()
print(categories)




def isFileExists(path_to_file):
   file_exists = exists(path_to_file)
   print("file_exists: " + str(file_exists))
   return file_exists
for c in range(0, len(categories)):   
	category = categories[c]	
	if(os.path.isdir(category)):
		subfolders = os.listdir(category)
		for s in range(0, 1):#len(subfolders)):
			subfolder = subfolders[s]
			imageList = os.listdir(category+"/"+subfolder)
			print(imageList)
			for x in range(0, len(imageList)):
				image = imageList[x]
				if image.startswith("resize")==False or image.startswith("quality") :
					INPUT_PATH = category + "/" + subfolder + "/" + image
					print(INPUT_PATH) 
					OUTPUT_PATH = category + "/" + subfolder + "/" + image.replace("png", "jpg")
					if isFileExists(OUTPUT_PATH)==False:
						subprocess.call("convert " +INPUT_PATH + " -resize 400x400 -define jpeg:extent=40KB " + OUTPUT_PATH +" && rm " + INPUT_PATH, shell=True)
						
