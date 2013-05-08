using UnityEngine;
using System.Collections;

public class MobSpawnerCS : MonoBehaviour {

  //Singleton instance
  public static MobSpawnerCS instance;

  //Level boundaries
  public Transform NorthWall;
  public Transform SouthWall;
  public Transform EastWall;
  public Transform WestWall;

  public int XSize = 10; //Suppose tehre's no need for these to be ints rather than say floats but whatever.
  public int YSize = 10;

  public Bounds levelBounds;


  //Wave information
  public int currentMobCount = 0;
  public int currentWaveNumber = 0;
  
  public int spilloverSpawnPoints = 0;

  public float waveStartTime = 1;
  public float waveStartTimeRemaining = 1;

  //Prefabs
  public BaseMobCS[] allMobPrefabs;
  public PlayerShipCS prefabPlayerShip;
  
  //Game status
  public PlayerShipCS playerShipInstance;
  public int playerScore = 0;
  
  //Debug flag
  public bool bDebug = false;

  public virtual void Start () {
	  if(instance != null)
	  {
		  if(instance != this) Destroy(this);
	  }
	  else
	  {
		  instance = this;
	
  		ResetGame();
		
		  if(prefabPlayerShip == null)
		  {
			  Debug.LogError("Error:  No player prefab!");
			  Debug.Break();
		  }

		  //Camera needs to be zoomed to match as well... it's ortho so just have to set the size properly.  Worry about it later.
	  }
  }

  public void OnGUI()
  {
    if (currentMobCount <= 0 && waveStartTimeRemaining > 0)
    {
      GUI.Label(new Rect(25, 25, 200, 50), "Wave " + currentWaveNumber.ToString() + " Completed.  Next wave in: " + waveStartTimeRemaining.ToString());
    }
    
    if (playerShipInstance = null)
    {
      GUI.Label(new Rect(25, 25, 50, 50), "GAME OVAR!!");
    }
  }

  public virtual void Update () {

	if(currentMobCount <= 0)
	{
    if (waveStartTimeRemaining > 0)
    {
      waveStartTimeRemaining -= Time.deltaTime;
    }
    else
    {
      waveStartTimeRemaining = waveStartTime;
      SpawnWave();
    }
		
	}
    
}

  public void SpawnWave()
  {
		if(bDebug) Debug.Log("Spawning wave " + currentWaveNumber);

		int spawnPoints = currentWaveNumber * currentWaveNumber; //x squared seems like a rough way to go really, the difficulty gets steep fast.  Too bad!  Tune it later.
    int spawnPointsRemaining = spawnPoints + spilloverSpawnPoints;
		
    System.Collections.Generic.List<BaseMobCS> availableMobs = new System.Collections.Generic.List<BaseMobCS>();

    //Generic.List< availableMobs : Generic.List.<BaseMob> = new Generic.List.<BaseMob>();
		    	
		for (int i = 0; i < allMobPrefabs.Length; i++)
		{
			if(bDebug) Debug.Log("i: " + i);
			if (allMobPrefabs[i].scoreValue <= spawnPointsRemaining)
				availableMobs.Add(allMobPrefabs[i]);
		}
		if(bDebug) Debug.Log("availableMobs.Count: " + availableMobs.Count);

		while(spawnPointsRemaining > 0)
		{
			BaseMobCS NewMob;
			int MobInt = Random.Range(0, availableMobs.Count);
			int spawnClusterSize = 1;
			
			NewMob = availableMobs[MobInt];
			
			//I can do better than this division but not a problem for the moment...
			Vector3 targetLocation = new Vector3(Random.Range(-XSize / 2,XSize / 2), 0, Random.Range(-YSize / 2,YSize / 2));
			
			if(spawnPointsRemaining > 30 * NewMob.scoreValue)
			{
				NewMob.LevelUp();
				if(bDebug) Debug.Log("LevelUp!");
			}
			
			if(spawnPointsRemaining > 10 * NewMob.scoreValue)
			{
				spawnClusterSize = 5;
				if(bDebug) Debug.Log("Spawning cluster of 5");
			}
			
			for(int j = 0; j < spawnClusterSize; j++)
			{
				Instantiate(NewMob, targetLocation, Random.rotation);
				currentMobCount += 1;
				spawnPointsRemaining -= (int)NewMob.scoreValue;
			}
			
			if(!NewMob)
			{
				spawnPointsRemaining = 0;
			}
			
			if (currentMobCount > 100)
			{
				return;
			}
		
		}

    spilloverSpawnPoints =  spawnPointsRemaining;
  }


public void OnDrawGizmos()
{
	Gizmos.DrawWireSphere(transform.position, 1);
}

public void ResetGame()
{

	if (XSize < 5) XSize = 5;
	if (YSize < 5) YSize = 5;
	
	levelBounds.SetMinMax(new Vector3((-XSize / 2) - 1, -1, -(YSize / 2) - 1), new Vector3(1 + XSize / 2, 1, 1 + YSize / 2));
	
  Vector3 newPosition = new Vector3(0,0,0);
  Vector3 newScale = new Vector3(1,1,1);

  newPosition.z = (YSize + 2) / 2;
  newScale.x = XSize + 1;

	NorthWall.position = new Vector3(0,0,(YSize + 2) / 2);
	NorthWall.localScale = new Vector3(XSize + 1, 1, 1);
	
	SouthWall.position = new Vector3(0,0,-(YSize + 2) / 2);
	SouthWall.localScale = new Vector3(XSize + 1, 1, 1);
	
	EastWall.position = new Vector3((XSize + 2) / 2, 0, 0);
	EastWall.localScale = new Vector3(1, 1, YSize + 3);
	
	WestWall.position = new Vector3(-(XSize + 2) / 2, 0, 0);
	WestWall.localScale = new Vector3(1, 1, YSize + 3);
		
	spilloverSpawnPoints = 0;

  playerScore = 0;

  currentWaveNumber = 0;

	for (int i = 0; i < allMobPrefabs.Length; i++)
	{
		allMobPrefabs[i].ResetLevel();
	}
	
	playerShipInstance = (PlayerShipCS) Instantiate(prefabPlayerShip, new Vector3(0,0,0), Quaternion.identity);
}



}
